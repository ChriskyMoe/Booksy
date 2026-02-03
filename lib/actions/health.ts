"use server";

import { createClient } from "@/lib/supabase/server";

export async function getHealthDashboardData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
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
    .select("base_amount, category:categories(type)")
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

  // Fetch upcoming expenses (next 30 days from today)
  const today = new Date();
  const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const todayStr = today.toISOString().split("T")[0];
  const thirtyDaysStr = thirtyDaysLater.toISOString().split("T")[0];

  const { data: upcomingExpensesData } = await supabase
    .from("transactions")
    .select("*, category:categories(type, name)")
    .eq("business_id", business.id)
    .eq("category.type", "expense")
    .gte("transaction_date", todayStr)
    .lte("transaction_date", thirtyDaysStr)
    .order("transaction_date", { ascending: true })
    .limit(3);

  const expenses = (upcomingExpensesData || []).map((exp: any) => ({
    name: exp.category?.name || exp.client_vendor || "Expense",
    dueDate: new Date(exp.transaction_date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    amount: Number(exp.base_amount),
  }));

  // Fetch receivables from invoices (status: sent or overdue)
  const { data: invoicesData } = await supabase
    .from("invoices")
    .select("*")
    .eq("business_id", business.id)
    .order("due_date", { ascending: true });

  let receivables = (invoicesData || []).map((invoice: any) => {
    const dueDate = new Date(invoice.due_date);
    const isOverdue =
      invoice.status === "overdue" ||
      (dueDate < today && invoice.status !== "paid");
    return {
      name: invoice.client_name,
      dueDate: dueDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      amount: Number(invoice.total_amount),
      isOverdue,
    };
  });

  // Calculate totals for remaining balance calculation
  const totalReceivables = receivables.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalToPay = expenses.reduce((sum, item) => sum + item.amount, 0);

  // Remaining balance: current cash + to receive - to pay
  const remainingBalance = currentCash + totalReceivables - totalToPay;

  // Safe cash: current cash + 25%
  const safeCash = currentCash + currentCash * 0.25;

  // Determine health status and explanation
  let status: "safe" | "warning" | "at-risk" = "safe";
  let explanation = "";
  const warningThreshold = safeCash;

  if (remainingBalance < 0) {
    status = "at-risk";
    explanation = `Your projected remaining balance is negative (${business.base_currency}${remainingBalance.toLocaleString()}). You need ${business.base_currency}${Math.abs(remainingBalance).toLocaleString()} more to cover upcoming expenses. Urgent action required!`;
  } else if (remainingBalance < warningThreshold) {
    status = "warning";
    explanation = `After paying bills and receiving payments, you'll have ${business.base_currency}${remainingBalance.toLocaleString()}. This is below the safe cash threshold of ${business.base_currency}${warningThreshold.toLocaleString()}. Consider delaying non-essential expenses or accelerating receivables collection.`;
  } else {
    status = "safe";
    explanation = `Your projected remaining balance is healthy at ${business.base_currency}${remainingBalance.toLocaleString()} after all pending transactions. You have sufficient buffer for unexpected costs.`;
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
  if (expenses.length > 0) {
    const nextExpense = expenses[0];
    alerts.push({
      id: "1",
      type: "urgent" as const,
      message: `${nextExpense.name} due on ${nextExpense.dueDate}`,
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
