'use server'

import { createClient } from '@/lib/supabase/server'

export async function getCategories() {
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
    .select('*')
    .eq('business_id', business.id)
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
