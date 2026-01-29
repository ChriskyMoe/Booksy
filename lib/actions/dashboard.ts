'use server'

import { createClient } from '@/lib/supabase/server'

export async function getDashboardData(period?: { startDate: string; endDate: string }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get business
  const { data: business } = await supabase
    .from('businesses')
    .select('id, base_currency')
    .eq('user_id', user.id)
    .single()

  if (!business) {
    return { error: 'Business not found' }
  }

  // Build date filter
  let dateFilter = {}
  if (period) {
    dateFilter = {
      gte: period.startDate,
      lte: period.endDate,
    }
  }

  // Get all transactions
  let query = supabase
    .from('transactions')
    .select('*, category:categories(*)')
    .eq('business_id', business.id)

  if (period) {
    query = query.gte('transaction_date', period.startDate).lte('transaction_date', period.endDate)
  }

  const { data: transactions, error } = await query

  if (error) {
    return { error: error.message }
  }

  // Calculate metrics
  const income = transactions
    ?.filter((t) => t.category?.type === 'income')
    .reduce((sum, t) => sum + Number(t.base_amount), 0) || 0

  const expenses = transactions
    ?.filter((t) => t.category?.type === 'expense')
    .reduce((sum, t) => sum + Number(t.base_amount), 0) || 0

  const profit = income - expenses

  // Calculate cash balance (all transactions)
  const { data: allTransactions } = await supabase
    .from('transactions')
    .select('base_amount, category:categories(type)')
    .eq('business_id', business.id)

  const cashBalance =
    allTransactions?.reduce((sum, t) => {
      const amount = Number(t.base_amount)
      return t.category?.type === 'income' ? sum + amount : sum - amount
    }, 0) || 0

  // Expense breakdown by category
  const expenseBreakdown = transactions
    ?.filter((t) => t.category?.type === 'expense')
    .reduce((acc, t) => {
      const categoryName = t.category?.name || 'Uncategorized'
      acc[categoryName] = (acc[categoryName] || 0) + Number(t.base_amount)
      return acc
    }, {} as Record<string, number>) || {}

  return {
    data: {
      income,
      expenses,
      profit,
      cashBalance,
      expenseBreakdown,
      currency: business.base_currency,
    },
  }
}

interface ChartDataPoint {
  date: string; // "YYYY-MM" for monthly, "YYYY" for annual
  income: number;
  expenses: number;
}

export async function getIncomeExpenseChartData(): Promise<{ data?: ChartDataPoint[]; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!business) {
    return { error: 'Business not found' };
  }

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('transaction_date, base_amount, category:categories(type)')
    .eq('business_id', business.id);

  if (error) {
    return { error: error.message };
  }

  const monthlyDataMap = new Map<string, { income: number; expenses: number }>();

  transactions.forEach(transaction => {
    const date = new Date(transaction.transaction_date);
    const month = date.toISOString().substring(0, 7); // YYYY-MM

    if (!monthlyDataMap.has(month)) {
      monthlyDataMap.set(month, { income: 0, expenses: 0 });
    }

    const currentMonthData = monthlyDataMap.get(month)!;
    const amount = Number(transaction.base_amount);

    if (transaction.category?.type === 'income') {
      currentMonthData.income += amount;
    } else if (transaction.category?.type === 'expense') {
      currentMonthData.expenses += amount;
    }
  });

  const sortedMonths = Array.from(monthlyDataMap.keys()).sort();

  const chartData: ChartDataPoint[] = sortedMonths.map(month => ({
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

export async function getExpenseBreakdownChartData(period?: { startDate: string; endDate: string }): Promise<{ data?: ExpenseBreakdownDataPoint[]; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!business) {
    return { error: 'Business not found' };
  }

  let query = supabase
    .from('transactions')
    .select('base_amount, category:categories(name, type)')
    .eq('business_id', business.id)
    .eq('category.type', 'expense');

  if (period) {
    query = query.gte('transaction_date', period.startDate).lte('transaction_date', period.endDate);
  }

  const { data: transactions, error } = await query;

  if (error) {
    return { error: error.message };
  }

  const expenseBreakdownMap = new Map<string, number>();
  let totalExpenses = 0;

  transactions.forEach(transaction => {
    const categoryName = transaction.category?.name || 'Uncategorized';
    const amount = Number(transaction.base_amount);
    expenseBreakdownMap.set(categoryName, (expenseBreakdownMap.get(categoryName) || 0) + amount);
    totalExpenses += amount;
  });

  // Convert map to array of objects, filter out categories with 0 value
  const chartData: ExpenseBreakdownDataPoint[] = Array.from(expenseBreakdownMap.entries())
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
    }));
    
  return { data: chartData };
}
