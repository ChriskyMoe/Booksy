'use server'

import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/supabase'

type Account = Database['public']['Tables']['accounts']['Insert']

const defaultAccounts: Omit<Account, 'business_id'>[] = [
  // Assets
  { name: 'Cash', type: 'asset', code: '1010', is_default: true },
  { name: 'Accounts Receivable', type: 'asset', code: '1200', is_default: true },
  { name: 'Inventory', type: 'asset', code: '1400', is_default: true },
  { name: 'Prepaid Expenses', type: 'asset', code: '1500', is_default: true },
  { name: 'Fixed Assets', type: 'asset', code: '1600', is_default: true },

  // Liabilities
  { name: 'Accounts Payable', type: 'liability', code: '2010', is_default: true },
  { name: 'Credit Card', type: 'liability', code: '2020', is_default: true },
  { name: 'Sales Tax Payable', type: 'liability', code: '2100', is_default: true },
  { name: 'Loans Payable', type: 'liability', code: '2500', is_default: true },

  // Equity
  { name: 'Owner\'s Equity', type: 'equity', code: '3010', is_default: true },
  { name: 'Retained Earnings', type: 'equity', code: '3020', is_default: true },

  // Revenue
  { name: 'Sales Revenue', type: 'revenue', code: '4010', is_default: true },
  { name: 'Service Revenue', type: 'revenue', code: '4020', is_default: true },
  { name: 'Other Income', type: 'revenue', code: '4900', is_default: true },

  // Expenses
  { name: 'Cost of Goods Sold', type: 'expense', code: '5010', is_default: true },
  { name: 'Advertising Expense', type: 'expense', code: '6010', is_default: true },
  { name: 'Bank Fees', type: 'expense', code: '6020', is_default: true },
  { name: 'Office Supplies', type: 'expense', code: '6030', is_default: true },
  { name: 'Rent Expense', type: 'expense', code: '6040', is_default: true },
  { name: 'Utilities Expense', type: 'expense', code: '6050', is_default: true },
  { name: 'Wages Expense', type: 'expense', code: '6060', is_default: true },
]

export async function createDefaultAccounts(businessId: string) {
  const supabase = await createClient()

  const accountsToInsert = defaultAccounts.map((account) => ({
    ...account,
    business_id: businessId,
  }))

  const { error } = await supabase.from('accounts').insert(accountsToInsert)

  if (error) {
    console.error('Error creating default accounts:', error)
    return { error: 'Could not create default accounts.' }
  }

  return { success: true }
}

export async function getAccountByName(name: string, businessId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('accounts')
    .select('id')
    .eq('name', name)
    .eq('business_id', businessId)
    .single()

  if (error) {
    console.error(`Error getting account by name "${name}":`, error)
    return { error: 'Could not find account.' }
  }

  return { data }
}
