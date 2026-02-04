"use server";

import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";

type Transaction = Database["public"]["Tables"]["transactions"]["Row"] & {
  category: Database["public"]["Tables"]["categories"]["Row"] | null;
};

export async function getDashboardData(period?: {
  startDate: string;
  endDate: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "Not authenticated" };
  }

  // Get business
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id, base_currency")
    .eq("user_id", user.id)
    .single();

  if (businessError || !business) {
    return { data: null, error: "Business not found" };
  }

  // Get all transactions
  let query = supabase
    .from("transactions")
    .select("*, category:categories(*)")
    .eq("business_id", business.id);

  if (period) {
    query = query
      .gte("transaction_date", period.startDate)
      .lte("transaction_date", period.endDate);
  }

  const { data: transactions, error } = await query;

  if (error) {
    return { data: null, error: error.message };
  }

  const allRows = (transactions || []) as Transaction[];
  const typedTransactions = allRows.filter(
    (t: any) => (t.status ?? "posted") !== "void"
  );

  // Calculate metrics (exclude voided)
  const income = typedTransactions
    .filter((t) => t.category?.type === "income")
    .reduce((sum, t) => sum + Number(t.base_amount), 0);

  const expenses = typedTransactions
    .filter((t) => t.category?.type === "expense")
    .reduce((sum, t) => sum + Number(t.base_amount), 0);

  const profit = income - expenses;

  // Calculate cash balance (exclude voided when status column exists)
  const { data: allTransactionsData } = await supabase
    .from("transactions")
    .select("base_amount, category:categories(type)")
    .eq("business_id", business.id);

  const allTransactions = ((allTransactionsData || []) as any[]).filter(
    (t: any) => (t.status ?? "posted") !== "void"
  );

  const cashBalance = allTransactions.reduce((sum, t) => {
    const amount = Number(t.base_amount);
    return t.category?.type === "income" ? sum + amount : sum - amount;
  }, 0);

  // Expense breakdown by category
  const expenseBreakdown = typedTransactions
    .filter((t) => t.category?.type === "expense")
    .reduce(
      (acc, t) => {
        const categoryName = t.category?.name || "Uncategorized";
        acc[categoryName] = (acc[categoryName] || 0) + Number(t.base_amount);
        return acc;
      },
      {} as Record<string, number>
    );

  return {
    data: {
      income,
      expenses,
      profit,
      cashBalance,
      expenseBreakdown,
      currency: business.base_currency,
    },
    error: null,
  };
}

export async function getIncomeExpenseComparisonData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id, base_currency")
    .eq("user_id", user.id)
    .single();

  if (businessError || !business)
    return { data: null, error: "Business not found" };

  const { data: transactionsData, error } = await supabase
    .from("transactions")
    .select("transaction_date, base_amount, category:categories(type)")
    .eq("business_id", business.id);

  if (error) return { data: null, error: error.message };

  const transactions = ((transactionsData || []) as any[]).filter(
    (t: any) => (t.status ?? "posted") !== "void"
  );
  const monthlyMap = new Map<string, { income: number; expenses: number }>();

  transactions.forEach((t) => {
    const key = String(t.transaction_date).substring(0, 7); // YYYY-MM
    if (!monthlyMap.has(key)) {
      monthlyMap.set(key, { income: 0, expenses: 0 });
    }
    const current = monthlyMap.get(key)!;
    if (t.category?.type === "income") {
      current.income += Number(t.base_amount);
    } else if (t.category?.type === "expense") {
      current.expenses += Number(t.base_amount);
    }
  });

  const chartData = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
    }));

  const totalIncome = chartData.reduce((sum, d) => sum + d.income, 0);
  const totalExpenses = chartData.reduce((sum, d) => sum + d.expenses, 0);
  const netProfit = totalIncome - totalExpenses;

  return {
    data: {
      chartData,
      summary: {
        totalIncome,
        totalExpenses,
        netProfit,
      },
      currency: business.base_currency,
    },
    error: null,
  };
}

interface ChartDataPoint {
  date: string;
  income: number;
  expenses: number;
}

export async function getIncomeExpenseChartData(): Promise<{
  data?: ChartDataPoint[];
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (businessError || !business) {
    return { error: "Business not found" };
  }

  const { data: transactionsData, error } = await supabase
    .from("transactions")
    .select("transaction_date, base_amount, category:categories(type)")
    .eq("business_id", business.id);

  if (error) {
    return { error: error.message };
  }

  const transactions = ((transactionsData || []) as any[]).filter(
    (t: any) => (t.status ?? "posted") !== "void"
  );
  const monthlyDataMap = new Map<
    string,
    { income: number; expenses: number }
  >();

  transactions.forEach((transaction) => {
    const date = new Date(transaction.transaction_date);
    const month = date.toISOString().substring(0, 7); // YYYY-MM

    if (!monthlyDataMap.has(month)) {
      monthlyDataMap.set(month, { income: 0, expenses: 0 });
    }

    const currentMonthData = monthlyDataMap.get(month)!;
    const amount = Number(transaction.base_amount);

    if (transaction.category?.type === "income") {
      currentMonthData.income += amount;
    } else if (transaction.category?.type === "expense") {
      currentMonthData.expenses += amount;
    }
  });

  const sortedMonths = Array.from(monthlyDataMap.keys()).sort();

  const chartData: ChartDataPoint[] = sortedMonths.map((month) => ({
    date: month,
    income: monthlyDataMap.get(month)!.income,
    expenses: monthlyDataMap.get(month)!.expenses,
  }));

  return { data: chartData };
}

interface ExpenseBreakdownDataPoint {
  name: string;
  value: number;
}

export async function getExpenseBreakdownChartData(period?: {
  startDate: string;
  endDate: string;
}): Promise<{ data?: ExpenseBreakdownDataPoint[]; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (businessError || !business) {
    return { error: "Business not found" };
  }

  let query = supabase
    .from("transactions")
    .select("base_amount, category:categories(name, type)")
    .eq("business_id", business.id)
    .eq("category.type", "expense");

  if (period) {
    query = query
      .gte("transaction_date", period.startDate)
      .lte("transaction_date", period.endDate);
  }

  const { data: transactionsData, error } = await query;

  if (error) {
    return { error: error.message };
  }

  const transactions = ((transactionsData || []) as any[]).filter(
    (t: any) => (t.status ?? "posted") !== "void"
  );
  const expenseBreakdownMap = new Map<string, number>();

  transactions.forEach((transaction) => {
    const categoryName = transaction.category?.name || "Uncategorized";
    const amount = Number(transaction.base_amount);
    expenseBreakdownMap.set(
      categoryName,
      (expenseBreakdownMap.get(categoryName) || 0) + amount
    );
  });

  const chartData: ExpenseBreakdownDataPoint[] = Array.from(
    expenseBreakdownMap.entries()
  )
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
    }));

  return { data: chartData };
}
