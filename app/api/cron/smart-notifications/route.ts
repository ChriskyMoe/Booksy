import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/notifications/email";
import { triggerHealthAlertWebhooks } from "@/lib/actions/health";

export const runtime = "nodejs";

const REMINDER_DAYS = Number(process.env.INVOICE_REMINDER_DAYS ?? 3);
const UPCOMING_EXPENSE_DAYS = 30;

type InvoiceRow = {
  id: string;
  invoice_number: string;
  client_name: string;
  due_date: string;
  total_amount: number;
  payment_status: "unpaid" | "partial" | "paid";
  invoice_payments?: { amount: number }[];
  currency?: string;
};

function formatCurrency(amount: number, currency?: string) {
  const prefix = currency ? `${currency} ` : "$";
  return `${prefix}${amount.toFixed(2)}`;
}

export async function GET(req: Request) {
  const secret = req.headers.get("x-cron-secret");
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: businesses, error } = await supabase
    .from("businesses")
    .select("id, user_id, base_currency");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let remindersSent = 0;
  let negativeBalanceAlerts = 0;
  const errors: string[] = [];

  const today = new Date();
  const reminderDate = new Date();
  reminderDate.setDate(reminderDate.getDate() + REMINDER_DAYS);
  const todayStr = today.toISOString().split("T")[0];
  const reminderDateStr = reminderDate.toISOString().split("T")[0];

  const upcomingExpenseDate = new Date();
  upcomingExpenseDate.setDate(
    upcomingExpenseDate.getDate() + UPCOMING_EXPENSE_DAYS
  );
  const upcomingExpenseDateStr = upcomingExpenseDate
    .toISOString()
    .split("T")[0];

  for (const business of businesses || []) {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.admin.getUserById(business.user_id);

      if (userError || !userData?.user?.email) {
        continue;
      }

      const userEmail = userData.user.email;

      // Invoice due reminders
      const { data: invoices, error: invoicesError } = await supabase
        .from("invoices")
        .select(
          "id, invoice_number, client_name, due_date, total_amount, payment_status, currency, invoice_payments(amount)"
        )
        .eq("business_id", business.id)
        .in("payment_status", ["unpaid", "partial"])
        .gte("due_date", todayStr)
        .lte("due_date", reminderDateStr);

      if (invoicesError) {
        throw invoicesError;
      }

      const dueInvoices = (invoices || [])
        .map((invoice) => {
          const typed = invoice as InvoiceRow;
          const totalPaid =
            typed.invoice_payments?.reduce(
              (sum, p) => sum + Number(p.amount),
              0
            ) || 0;
          const remaining = Number(typed.total_amount) - totalPaid;

          return {
            ...typed,
            remaining,
          };
        })
        .filter((invoice) => invoice.remaining > 0);

      if (dueInvoices.length > 0) {
        const itemsHtml = dueInvoices
          .map(
            (invoice) => `
              <li>
                <strong>${invoice.invoice_number}</strong> – ${invoice.client_name}<br />
                Due: ${new Date(invoice.due_date).toLocaleDateString()}<br />
                Remaining: ${formatCurrency(invoice.remaining, invoice.currency)}
              </li>
            `
          )
          .join("");

        await sendEmail({
          to: userEmail,
          subject: `Invoice Due Reminder (${dueInvoices.length})`,
          html: `
            <div>
              <p>You have invoices due in the next ${REMINDER_DAYS} day(s):</p>
              <ul>${itemsHtml}</ul>
            </div>
          `,
          text: `You have invoices due in the next ${REMINDER_DAYS} day(s).`,
        });

        remindersSent += 1;
      }

      // Negative remaining balance alert
      const { data: allTransactions, error: txError } = await supabase
        .from("transactions")
        .select("base_amount, transaction_date, category:categories(type)")
        .eq("business_id", business.id);

      if (txError) {
        throw txError;
      }

      let totalIncome = 0;
      let totalExpenses = 0;

      (allTransactions || []).forEach((tx: any) => {
        if (tx.category?.type === "income") {
          totalIncome += Number(tx.base_amount);
        } else if (tx.category?.type === "expense") {
          totalExpenses += Number(tx.base_amount);
        }
      });

      const currentCash = totalIncome - totalExpenses;

      const { data: upcomingExpenses, error: upcomingExpensesError } =
        await supabase
          .from("transactions")
          .select("base_amount, category:categories(type)")
          .eq("business_id", business.id)
          .eq("category.type", "expense")
          .gte("transaction_date", todayStr)
          .lte("transaction_date", upcomingExpenseDateStr);

      if (upcomingExpensesError) {
        throw upcomingExpensesError;
      }

      const totalToPay = (upcomingExpenses || []).reduce(
        (sum: number, exp: any) => sum + Number(exp.base_amount),
        0
      );

      const { data: openInvoices, error: openInvoicesError } = await supabase
        .from("invoices")
        .select("total_amount, payment_status, invoice_payments(amount)")
        .eq("business_id", business.id)
        .in("payment_status", ["unpaid", "partial"]);

      if (openInvoicesError) {
        throw openInvoicesError;
      }

      const totalReceivables = (openInvoices || []).reduce(
        (sum: number, invoice: any) => {
          const totalPaid =
            invoice.invoice_payments?.reduce(
              (pSum: number, p: any) => pSum + Number(p.amount),
              0
            ) || 0;
          const remaining = Number(invoice.total_amount) - totalPaid;
          return sum + Math.max(remaining, 0);
        },
        0
      );

      const remainingBalance = currentCash + totalReceivables - totalToPay;

      if (remainingBalance < 0) {
        await sendEmail({
          to: userEmail,
          subject: "Alert: Projected Balance Below 0",
          html: `
            <div>
              <p>Your projected remaining balance is negative.</p>
              <p><strong>Projected Balance:</strong> ${formatCurrency(
                remainingBalance,
                business.base_currency
              )}</p>
              <p>Consider accelerating receivables or delaying expenses.</p>
            </div>
          `,
          text: `Your projected remaining balance is negative: ${formatCurrency(
            remainingBalance,
            business.base_currency
          )}.`,
        });

        negativeBalanceAlerts += 1;
      }
    } catch (err) {
      errors.push(
        err instanceof Error ? err.message : "Unknown notification error"
      );
    }
  }

  // Trigger webhook health alerts via n8n
  const webhookResult = await triggerHealthAlertWebhooks();

  return NextResponse.json({
    businessesProcessed: businesses?.length || 0,
    remindersSent,
    negativeBalanceAlerts,
    webhooksTriggered: webhookResult.triggered,
    webhookErrors: webhookResult.errors,
    errors,
  });
}
