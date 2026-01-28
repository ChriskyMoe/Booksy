'use server'

import { createClient } from '@/lib/supabase/server'

export async function getBusiness() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function updateBusiness(updates: {
  name?: string
  business_type?: string
  base_currency?: string
  fiscal_year_start_month?: number
  fiscal_year_start_day?: number
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('businesses')
    .update(updates)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function deleteBusiness() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('businesses')
    .delete()
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  return { data: { success: true } }
}
