'use server'

import { createClient } from '@/lib/supabase/server'
import { getExchangeRate } from '@/lib/currency'

export async function getTransactions(filters?: {
  categoryId?: string
  startDate?: string
  endDate?: string
  paymentMethod?: string
}) {
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
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!business) {
    return { error: 'Business not found' }
  }

  let query = supabase
    .from('transactions')
    .select('*, category:categories(*)')
    .eq('business_id', business.id)
    .order('transaction_date', { ascending: false })

  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId)
  }

  if (filters?.startDate) {
    query = query.gte('transaction_date', filters.startDate)
  }

  if (filters?.endDate) {
    query = query.lte('transaction_date', filters.endDate)
  }

  if (filters?.paymentMethod) {
    query = query.eq('payment_method', filters.paymentMethod)
  }

  const { data, error } = await query

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function createTransaction(transaction: {
  category_id: string
  amount: number
  currency: string
  transaction_date: string
  payment_method: 'cash' | 'card' | 'transfer' | 'other'
  client_vendor?: string
  notes?: string
}) {
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

  // Convert to base currency if needed
  let baseAmount = transaction.amount
  if (transaction.currency !== business.base_currency) {
    const rate = await getExchangeRate(
      transaction.currency,
      business.base_currency,
      transaction.transaction_date
    )
    baseAmount = transaction.amount * rate
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      business_id: business.id,
      ...transaction,
      base_amount: baseAmount,
    })
    .select('*, category:categories(*)')
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function updateTransaction(
  id: string,
  updates: {
    category_id?: string
    amount?: number
    currency?: string
    transaction_date?: string
    payment_method?: 'cash' | 'card' | 'transfer' | 'other'
    client_vendor?: string
    notes?: string
  }
) {
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

  // Recalculate base_amount if amount or currency changed
  if (updates.amount || updates.currency) {
    const { data: existing } = await supabase
      .from('transactions')
      .select('currency, amount')
      .eq('id', id)
      .single()

    const currency = updates.currency || existing?.currency || business.base_currency
    const amount = updates.amount || existing?.amount || 0

    let baseAmount = amount
    if (currency !== business.base_currency) {
      const rate = await getExchangeRate(
        currency,
        business.base_currency,
        updates.transaction_date || new Date().toISOString().split('T')[0]
      )
      baseAmount = amount * rate
    }
    updates = { ...updates, base_amount: baseAmount }
  }

  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select('*, category:categories(*)')
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase.from('transactions').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
