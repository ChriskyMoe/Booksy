'use server'

import { createClient } from '@/lib/supabase/server'

export async function getCategories(filter?: 'income' | 'expense') {
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
    .from('categories')
    .select('*')
    .eq('business_id', business.id)

  if (filter) {
    query = query.eq('type', filter)
  }

  const { data, error } = await query
    .order('type')
    .order('name')

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function createCategory(name: string, type: 'income' | 'expense') {
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

  const { data, error } = await supabase
    .from('categories')
    .insert({
      business_id: business.id,
      name,
      type,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function updateCategory(id: string, name: string, type: 'income' | 'expense') {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('categories')
    .update({ name, type })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function getCategoryWithTransactions(categoryId: string) {
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

  // Get category
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('*')
    .eq('id', categoryId)
    .eq('business_id', business.id)
    .single()

  if (categoryError || !category) {
    return { error: 'Category not found' }
  }

  // Get transactions for this category
  const { data: transactions, error: transactionsError } = await supabase
    .from('transactions')
    .select('*')
    .eq('category_id', categoryId)
    .order('transaction_date', { ascending: false })
    .limit(50)

  if (transactionsError) {
    return { error: transactionsError.message }
  }

  return { data: { category, transactions: transactions || [] } }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
