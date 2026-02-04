"use server";

import { createClient } from "@/lib/supabase/server";

const N8N_WEBHOOK_URL =
  "https://n8n.8genticai.de/webhook/415e4f4c-df66-45c9-9a9f-2431a76fbc91";

// Utility to add delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Check if notification was already sent today
async function wasNotificationSentToday(
  supabase: any,
  businessId: string,
  notificationType: string
): Promise<boolean> {
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("notification_log")
    .select("id")
    .eq("business_id", businessId)
    .eq("notification_type", notificationType)
    .gte("created_at", `${today}T00:00:00`)
    .limit(1);

  return (data && data.length > 0) || false;
}

// Log that a notification was sent
async function logNotification(
  supabase: any,
  businessId: string,
  notificationType: string
) {
  await supabase.from("notification_log").insert({
    business_id: businessId,
    notification_type: notificationType,
    created_at: new Date().toISOString(),
  });
}

async function triggerWebhookNotification(data: {
  userEmail: string;
  userName?: string;
  notificationType: "LOW_BALANCE" | "INVOICE_DUE_SOON" | "INVOICE_OVERDUE";
  details: any;
}) {
  try {
    console.log("🔔 Triggering webhook notification:", {
      type: data.notificationType,
      userEmail: data.userEmail,
      timestamp: new Date().toISOString(),
      webhookUrl: N8N_WEBHOOK_URL,
    });

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error("❌ Webhook failed:", {
        status: response.status,
        statusText: response.statusText,
        type: data.notificationType,
        response: responseText,
        url: N8N_WEBHOOK_URL,
      });
    } else {
      console.log("✅ Webhook success:", {
        status: response.status,
        type: data.notificationType,
      });
    }

    return { success: response.ok, status: response.status };
  } catch (error) {
    console.error("❌ Failed to trigger webhook notification:", error);
    return { success: false, error };
  }
}

export async function triggerLowBalanceIfNeeded(params: {
  businessId: string;
  userEmail: string;
  userName?: string;
  expenseDelta?: number;
}) {
  const { businessId, userEmail, userName, expenseDelta } = params;
  const supabase = await createClient();

  if (!userEmail) return;

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id, base_currency")
    .eq("id", businessId)
    .single();

  if (businessError || !business) return;

  // Current cash from transactions
  const { data: allTransactions, error: txError } = await supabase
    .from("transactions")
    .select("base_amount, category:categories(type)")
    .eq("business_id", businessId);

  if (txError) return;

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

  // Receivables (income invoices, unpaid)
  const { data: incomeInvoices } = await supabase
    .from("invoices")
    .select("total_amount, status")
    .eq("business_id", businessId)
    .eq("type", "income");

  const totalReceivables = (incomeInvoices || [])
    .filter((i: any) => i.status !== "paid" && i.status !== "draft")
    .reduce((sum: number, i: any) => sum + Number(i.total_amount), 0);

  // Payables (expense invoices, unpaid)
  const { data: expenseInvoices } = await supabase
    .from("invoices")
    .select("total_amount, status")
    .eq("business_id", businessId)
    .eq("type", "expense");

  const totalToPay = (expenseInvoices || [])
    .filter((i: any) => i.status !== "paid" && i.status !== "draft")
    .reduce((sum: number, i: any) => sum + Number(i.total_amount), 0);

  const netBalance = currentCash + totalReceivables - totalToPay;
  const isAtRisk = currentCash < 0 || netBalance < 0;

  // Only trigger if it crossed below 0 due to this expense
  if (isAtRisk) {
    if (typeof expenseDelta === "number" && expenseDelta > 0) {
      const previousNet = netBalance + expenseDelta;
      const previousCurrentCash = currentCash + expenseDelta;
      if (previousNet < 0 || previousCurrentCash < 0) return;
    }

    const alreadySent = await wasNotificationSentToday(
      supabase,
      businessId,
      "LOW_BALANCE"
    );

    if (!alreadySent) {
      await delay(500);
      triggerWebhookNotification({
        userEmail,
        userName,
        notificationType: "LOW_BALANCE",
        details: {
          currency: business.base_currency,
          currentCash,
          netBalance,
          totalReceivables,
          totalToPay,
          deficit:
            netBalance < 0 ? Math.abs(netBalance) : Math.abs(currentCash),
        },
      }).catch((err) => console.error("Webhook notification error:", err));

      await logNotification(supabase, businessId, "LOW_BALANCE");
    }
  }
}

export async function getHealthDashboardData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const userEmail = user.email || "";

  // Get user name from metadata or users table
  let userName =
    user.user_metadata?.full_name || user.user_metadata?.name || "";

  // If no name in metadata, try to get from users table
  if (!userName) {
    const { data: userData } = await supabase
      .from("users")
      .select("full_name, first_name, last_name")
      .eq("id", user.id)
      .single();

    if (userData) {
      userName =
        userData.full_name ||
        `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
        "User";
    }
  }

  // Fallback to email username if still no name
  if (!userName && userEmail) {
    userName = userEmail.split("@")[0];
  }

  // Get business
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id, base_currency")
    .eq("user_id", user.id)
    .single();

  if (businessError || !business) {
    return { error: "Business not found" };
  }

  // Fetch all transactions with their category types
  const { data: allTransactions, error: txError } = await supabase
    .from("transactions")
    .select("base_amount, transaction_date, category:categories(type)")
    .eq("business_id", business.id);

  if (txError) {
    return { error: txError.message };
  }

  const transactions = (allTransactions || []) as any[];

  // Calculate actual cash balance (income - expenses)
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach((tx) => {
    if (tx.category?.type === "income") {
      totalIncome += Number(tx.base_amount);
    } else if (tx.category?.type === "expense") {
      totalExpenses += Number(tx.base_amount);
    }
  });

  const currentCash = totalIncome - totalExpenses;

  const today = new Date();
  const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  let totalMonthlyExpenses = 0;

  transactions.forEach((tx) => {
    if (tx.category?.type !== "expense") return;
    if (!tx.transaction_date) return;
    const txDate = new Date(tx.transaction_date);
    if (Number.isNaN(txDate.getTime())) return;
    if (txDate >= last30Days && txDate <= today) {
      totalMonthlyExpenses += Number(tx.base_amount);
    }
  });

  const safeCash = Math.max(
    totalMonthlyExpenses * 0.25,
    totalMonthlyExpenses * (14 / 30)
  );

  // Fetch payables from expense invoices (exclude paid)
  const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const { data: expenseInvoicesData } = await supabase
    .from("invoices")
    .select("*")
    .eq("business_id", business.id)
    .eq("type", "expense")
    .order("due_date", { ascending: true });

  const unpaidExpenseInvoices = (expenseInvoicesData || []).filter(
    (invoice: any) => invoice.status !== "paid" && invoice.status !== "draft"
  );

  const expenses = unpaidExpenseInvoices
    .sort(
      (a: any, b: any) =>
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    )
    .slice(0, 3)
    .map((invoice: any) => ({
      name: invoice.client_name || "Payable",
      dueDate: new Date(invoice.due_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      amount: Number(invoice.total_amount),
      isOverdue:
        invoice.status === "overdue" || new Date(invoice.due_date) < today,
      dueDateRaw: invoice.due_date,
    }));

  // Fetch receivables from invoices (exclude paid)
  const { data: invoicesData } = await supabase
    .from("invoices")
    .select("*")
    .eq("business_id", business.id)
    .eq("type", "income")
    .order("due_date", { ascending: true });

  const unpaidInvoices = (invoicesData || []).filter(
    (invoice: any) => invoice.status !== "paid" && invoice.status !== "draft"
  );

  let receivables = unpaidInvoices.map((invoice: any) => {
    const dueDate = new Date(invoice.due_date);
    const isOverdue = invoice.status === "overdue" || dueDate < today;
    return {
      name: invoice.client_name,
      dueDate: dueDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      amount: Number(invoice.total_amount),
      isOverdue,
      dueDateRaw: invoice.due_date,
    };
  });

  // Check for invoices due within 3 days and trigger webhook immediately
  const invoicesDueSoon = unpaidInvoices.filter((invoice: any) => {
    const dueDate = new Date(invoice.due_date);
    const daysDiff = Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff >= 0 && daysDiff <= 3;
  });

  if (invoicesDueSoon.length > 0) {
    const alreadySent = await wasNotificationSentToday(
      supabase,
      business.id,
      "INVOICE_DUE_SOON"
    );

    if (!alreadySent) {
      await delay(500);
      triggerWebhookNotification({
        userEmail,
        userName,
        notificationType: "INVOICE_DUE_SOON",
        details: {
          currency: business.base_currency,
          invoices: invoicesDueSoon.map((inv: any) => ({
            client_name: inv.client_name,
            invoice_number: inv.invoice_number,
            due_date: inv.due_date,
            amount: inv.total_amount,
            days_until_due: Math.ceil(
              (new Date(inv.due_date).getTime() - today.getTime()) /
                (1000 * 60 * 60 * 24)
            ),
          })),
        },
      }).catch((err) => console.error("Webhook notification error:", err));

      await logNotification(supabase, business.id, "INVOICE_DUE_SOON");
    }
  }

  // Check for overdue invoices and trigger webhook immediately
  const overdueInvoices = unpaidInvoices.filter((invoice: any) => {
    const dueDate = new Date(invoice.due_date);
    return dueDate < today;
  });

  if (overdueInvoices.length > 0) {
    const alreadySent = await wasNotificationSentToday(
      supabase,
      business.id,
      "INVOICE_OVERDUE"
    );

    if (!alreadySent) {
      await delay(500);
      triggerWebhookNotification({
        userEmail,
        userName,
        notificationType: "INVOICE_OVERDUE",
        details: {
          currency: business.base_currency,
          invoices: overdueInvoices.map((inv: any) => ({
            client_name: inv.client_name,
            invoice_number: inv.invoice_number,
            due_date: inv.due_date,
            amount: inv.total_amount,
            days_overdue: Math.ceil(
              (today.getTime() - new Date(inv.due_date).getTime()) /
                (1000 * 60 * 60 * 24)
            ),
          })),
        },
      }).catch((err) => console.error("Webhook notification error:", err));

      await logNotification(supabase, business.id, "INVOICE_OVERDUE");
    }
  }

  // Calculate totals for net balance calculation
  const totalReceivables = receivables.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalToPay = unpaidExpenseInvoices.reduce(
    (sum: number, invoice: any) => sum + Number(invoice.total_amount),
    0
  );

  // Net balance: current cash + receivables - payables
  const netBalance = currentCash + totalReceivables - totalToPay;
  const remainingBalance = netBalance;

  // Determine health status and explanation
  let status: "safe" | "warning" | "at-risk" = "safe";
  let explanation = "";
  if (currentCash < 0) {
    status = "at-risk";
    explanation = `Your current cash balance is negative (${business.base_currency}${currentCash.toLocaleString()}). Immediate action is required to restore positive cash flow.`;

    // Trigger webhook immediately for low balance
    const alreadySent = await wasNotificationSentToday(
      supabase,
      business.id,
      "LOW_BALANCE"
    );

    if (!alreadySent) {
      await delay(500);
      triggerWebhookNotification({
        userEmail,
        userName,
        notificationType: "LOW_BALANCE",
        details: {
          currency: business.base_currency,
          currentCash,
          remainingBalance,
          safeCash,
          totalReceivables,
          totalToPay,
          deficit: Math.abs(currentCash),
        },
      }).catch((err) => console.error("Webhook notification error:", err));

      await logNotification(supabase, business.id, "LOW_BALANCE");
    }
  } else if (remainingBalance < 0) {
    status = "at-risk";
    explanation = `Your projected net balance is negative (${business.base_currency}${remainingBalance.toLocaleString()}). You need ${business.base_currency}${Math.abs(remainingBalance).toLocaleString()} more to cover upcoming expenses. Urgent action required!`;

    // Trigger webhook immediately for low balance
    const alreadySent = await wasNotificationSentToday(
      supabase,
      business.id,
      "LOW_BALANCE"
    );

    if (!alreadySent) {
      await delay(500);
      triggerWebhookNotification({
        userEmail,
        userName,
        notificationType: "LOW_BALANCE",
        details: {
          currency: business.base_currency,
          currentCash,
          remainingBalance,
          safeCash,
          totalReceivables,
          totalToPay,
          deficit: Math.abs(remainingBalance),
        },
      }).catch((err) => console.error("Webhook notification error:", err));

      await logNotification(supabase, business.id, "LOW_BALANCE");
    }
  } else if (currentCash < safeCash) {
    status = "warning";
    explanation = `Your current cash (${business.base_currency}${currentCash.toLocaleString()}) is below the safe cash buffer of ${business.base_currency}${safeCash.toLocaleString()}. Consider delaying non-essential expenses or accelerating receivables collection.`;
  } else {
    status = "safe";
    explanation = `Your projected net balance is healthy at ${business.base_currency}${remainingBalance.toLocaleString()} after all pending transactions. You have sufficient buffer for unexpected costs.`;
  }

  // If no invoices found, fall back to income transactions from next 30 days
  //   if (receivables.length === 0) {
  //     const { data: receivablesData } = await supabase
  //       .from("transactions")
  //       .select("*, category:categories(type, name)")
  //       .eq("business_id", business.id)
  //       .eq("category.type", "income")
  //       .gte("transaction_date", todayStr)
  //       .lte("transaction_date", thirtyDaysStr)
  //       .order("transaction_date", { ascending: true });

  //     receivables = (receivablesData || []).map((recv: any) => {
  //       const dueDate = new Date(recv.transaction_date);
  //       const isOverdue = dueDate < today;
  //       return {
  //         name: recv.client_vendor || recv.category?.name || "Income",
  //         dueDate: isOverdue
  //           ? "Overdue"
  //           : dueDate.toLocaleDateString("en-US", {
  //               month: "short",
  //               day: "numeric",
  //               year: "numeric",
  //             }),
  //         amount: Number(recv.base_amount),
  //         isOverdue,
  //       };
  //     });
  //   }

  // Generate alerts
  const alerts = [];

  // Alert for upcoming expenses
  const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingPayables = unpaidExpenseInvoices
    .filter((invoice: any) => new Date(invoice.due_date) <= sevenDaysLater)
    .sort(
      (a: any, b: any) =>
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    );

  if (upcomingPayables.length > 0) {
    const nextExpense = upcomingPayables[0];
    alerts.push({
      id: "1",
      type: "urgent" as const,
      message: `${nextExpense.client_name || "Payable"} due on ${new Date(
        nextExpense.due_date
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`,
      icon: "clock" as const,
    });
  }

  // Alert for overdue receivables
  const overdueReceivables = receivables.filter((r) => r.isOverdue);
  if (overdueReceivables.length > 0) {
    alerts.push({
      id: "2",
      type: "warning" as const,
      message: `${overdueReceivables.length} payment${overdueReceivables.length > 1 ? "s" : ""} overdue`,
      icon: "alert" as const,
    });
  }

  // Alert for low cash flow
  if (status !== "safe") {
    alerts.push({
      id: "3",
      type: "warning" as const,
      message: "Cash flow is below recommended levels",
      icon: "trend" as const,
    });
  }

  return {
    healthData: {
      currentCash,
      remainingBalance,
      safeCash,
      status,
      explanation,
    },
    expenses,
    receivables,
    alerts,
  };
}

// Cron job function to trigger webhook notifications for all users
export async function triggerHealthAlertWebhooks() {
  const supabase = await createClient();

  // Get all businesses
  const { data: businesses, error: businessesError } = await supabase
    .from("businesses")
    .select("id, user_id, base_currency");

  if (businessesError || !businesses) {
    console.error("Error fetching businesses:", businessesError);
    return { error: "Failed to fetch businesses", triggered: 0 };
  }

  let triggered = 0;
  const errors = [];

  for (const business of businesses) {
    try {
      // Get user info
      const { data: userData } = await supabase
        .from("users")
        .select("id, email, full_name, first_name, last_name")
        .eq("id", business.user_id)
        .single();

      if (!userData) continue;

      const userEmail = userData.email || "";
      const userName =
        userData.full_name ||
        `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
        userEmail.split("@")[0];

      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const thirtyDaysAgoStr = new Date(
        today.getTime() - 30 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0];

      // Fetch all transactions
      const { data: allTransactions } = await supabase
        .from("transactions")
        .select("base_amount, category:categories(type)")
        .eq("business_id", business.id);

      const transactions = (allTransactions || []) as any[];
      let totalIncome = 0;
      let totalExpenses = 0;

      transactions.forEach((tx) => {
        if (tx.category?.type === "income") {
          totalIncome += Number(tx.base_amount);
        } else if (tx.category?.type === "expense") {
          totalExpenses += Number(tx.base_amount);
        }
      });

      const currentCash = totalIncome - totalExpenses;

      // Fetch invoices (unpaid only)
      const { data: incomeInvoicesData } = await supabase
        .from("invoices")
        .select("*")
        .eq("business_id", business.id)
        .eq("type", "income")
        .order("due_date", { ascending: true });

      const { data: expenseInvoicesData } = await supabase
        .from("invoices")
        .select("*")
        .eq("business_id", business.id)
        .eq("type", "expense")
        .order("due_date", { ascending: true });

      const unpaidIncomeInvoices = (incomeInvoicesData || []).filter(
        (invoice: any) =>
          invoice.status !== "paid" && invoice.status !== "draft"
      );
      const unpaidExpenseInvoices = (expenseInvoicesData || []).filter(
        (invoice: any) =>
          invoice.status !== "paid" && invoice.status !== "draft"
      );

      const receivables = unpaidIncomeInvoices.map((invoice: any) => ({
        amount: Number(invoice.total_amount),
        isOverdue: new Date(invoice.due_date) < today,
      }));

      // Calculate balances
      const totalReceivables = receivables.reduce(
        (sum, item) => sum + item.amount,
        0
      );
      const totalToPay = unpaidExpenseInvoices.reduce(
        (sum: number, invoice: any) => sum + Number(invoice.total_amount),
        0
      );
      const remainingBalance = currentCash + totalReceivables - totalToPay;

      const { data: monthlyExpenseTx } = await supabase
        .from("transactions")
        .select("base_amount, category:categories(type)")
        .eq("business_id", business.id)
        .eq("category.type", "expense")
        .gte("transaction_date", thirtyDaysAgoStr)
        .lte("transaction_date", todayStr);

      const totalMonthlyExpenses = (monthlyExpenseTx || []).reduce(
        (sum: number, tx: any) => sum + Number(tx.base_amount),
        0
      );

      const safeCash = Math.max(
        totalMonthlyExpenses * 0.25,
        totalMonthlyExpenses * (14 / 30)
      );

      // Check for low balance
      if (currentCash < 0 || remainingBalance < 0) {
        await triggerWebhookNotification({
          userEmail,
          userName,
          notificationType: "LOW_BALANCE",
          details: {
            currency: business.base_currency,
            currentCash,
            remainingBalance,
            safeCash,
            totalReceivables,
            totalToPay,
            deficit:
              remainingBalance < 0
                ? Math.abs(remainingBalance)
                : Math.abs(currentCash),
          },
        });
        triggered++;
      }

      // Check for invoices due soon (within 3 days)
      const invoicesDueSoon = unpaidIncomeInvoices.filter((invoice: any) => {
        const dueDate = new Date(invoice.due_date);
        const daysDiff = Math.ceil(
          (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysDiff >= 0 && daysDiff <= 3;
      });

      if (invoicesDueSoon.length > 0) {
        await triggerWebhookNotification({
          userEmail,
          userName,
          notificationType: "INVOICE_DUE_SOON",
          details: {
            currency: business.base_currency,
            invoices: invoicesDueSoon.map((inv: any) => ({
              client_name: inv.client_name,
              invoice_number: inv.invoice_number,
              due_date: inv.due_date,
              amount: inv.total_amount,
              days_until_due: Math.ceil(
                (new Date(inv.due_date).getTime() - today.getTime()) /
                  (1000 * 60 * 60 * 24)
              ),
            })),
          },
        });
        triggered++;
      }

      // Check for overdue invoices
      const overdueInvoices = unpaidIncomeInvoices.filter(
        (invoice: any) => new Date(invoice.due_date) < today
      );

      if (overdueInvoices.length > 0) {
        await triggerWebhookNotification({
          userEmail,
          userName,
          notificationType: "INVOICE_OVERDUE",
          details: {
            currency: business.base_currency,
            invoices: overdueInvoices.map((inv: any) => ({
              client_name: inv.client_name,
              invoice_number: inv.invoice_number,
              due_date: inv.due_date,
              amount: inv.total_amount,
              days_overdue: Math.ceil(
                (today.getTime() - new Date(inv.due_date).getTime()) /
                  (1000 * 60 * 60 * 24)
              ),
            })),
          },
        });
        triggered++;
      }
    } catch (error) {
      errors.push(`Error processing business ${business.id}: ${error}`);
    }
  }

  return { triggered, errors };
}
