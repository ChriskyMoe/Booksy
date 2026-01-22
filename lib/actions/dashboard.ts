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
