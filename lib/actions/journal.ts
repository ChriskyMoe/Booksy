'use server'

import { createClient } from '@/lib/supabase/server'
import { getExchangeRate } from '@/lib/currency'
import { getAccountByName } from './accounts'
import { Database } from '@/types/supabase'

type JournalLineInsert = Database['public']['Tables']['journal_lines']['Insert']

// This is the new core function for creating journal entries
export async function createJournalEntry(entry: {
  business_id: string
  transaction_date: string
  description: string
  lines: Omit<JournalLineInsert, 'journal_entry_id'>[]
}) {
  const supabase = await createClient()

  // 1. Validate that debits equal credits
  const totalDebits = entry.lines
    .filter((line) => line.type === 'debit')
    .reduce((sum, line) => sum + (line.amount || 0), 0)
  const totalCredits = entry.lines
    .filter((line) => line.type === 'credit')
    .reduce((sum, line) => sum + (line.amount || 0), 0)

  // Use a small tolerance for floating point comparisons
  if (Math.abs(totalDebits - totalCredits) > 0.0001) {
    return { error: 'Debits do not equal credits.' }
  }

  // 2. Create the journal entry header
  const { data: journalEntry, error: entryError } = await supabase
    .from('journal_entries')
    .insert({
      business_id: entry.business_id,
      transaction_date: entry.transaction_date,
      description: entry.description,
    })
    .select()
    .single()

  if (entryError) {
    console.error('Error creating journal entry:', entryError)
    return { error: 'Failed to create journal entry.' }
  }

  // 3. Create the journal lines
  const linesToInsert = entry.lines.map((line) => ({
    ...line,
    journal_entry_id: journalEntry.id,
  }))

  const { error: linesError } = await supabase.from('journal_lines').insert(linesToInsert)

  if (linesError) {
    console.error('Error creating journal lines:', linesError)
    // Here you might want to delete the journal_entry header for consistency
    await supabase.from('journal_entries').delete().eq('id', journalEntry.id)
    return { error: 'Failed to create journal lines.' }
  }

  return { data: journalEntry }
}

// This is a helper function to simplify creating common transactions from the UI
export async function createSimpleTransaction(transaction: {
  category_id: string
  amount: number
  currency: string
  transaction_date: string
  description: string
  payment_method: 'cash' | 'card' | 'transfer' | 'other'
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { data: business } = await supabase
    .from('businesses')
    .select('id, base_currency')
    .eq('user_id', user.id)
    .single()

  if (!business) return { error: 'Business not found' }
  
  // 1. Get the category to determine if it's income or expense
  const { data: category } = await supabase
    .from('categories')
    .select('id, name, type')
    .eq('id', transaction.category_id)
    .single()

  if (!category) return { error: 'Category not found' }

  // 2. Determine the accounts to use
  // This is a simplified mapping. A more robust solution might involve mapping categories to accounts.
  const cashAccountResult = await getAccountByName('Cash', business.id)
  const categoryAccountResult = await getAccountByName(category.name, business.id)
  
  if (cashAccountResult.error || !cashAccountResult.data) return { error: 'Cash account not found.' }

  // If a specific account for the category doesn't exist, we can fallback to a generic one or error out.
  // For now, we'll assume a matching account name exists for the category name.
  if (categoryAccountResult.error || !categoryAccountResult.data) return { error: `Account for category "${category.name}" not found.` }

  const cashAccountId = cashAccountResult.data.id
  const categoryAccountId = categoryAccountResult.data.id

  const lines: Omit<JournalLineInsert, 'journal_entry_id'>[] = []

  if (category.type === 'income') {
    lines.push({ account_id: cashAccountId, type: 'debit', amount: transaction.amount })
    lines.push({ account_id: categoryAccountId, type: 'credit', amount: transaction.amount })
  } else if (category.type === 'expense') {
    lines.push({ account_id: categoryAccountId, type: 'debit', amount: transaction.amount })
    lines.push({ account_id: cashAccountId, type: 'credit', amount: transaction.amount })
  } else {
    return { error: 'Invalid category type.' }
  }

  // 3. Create the journal entry using the core function
  return createJournalEntry({
    business_id: business.id,
    transaction_date: transaction.transaction_date,
    description: transaction.description,
    lines,
  })
}

export async function updateSimpleTransaction(
  journalEntryId: string,
  transaction: {
    category_id: string
    amount: number
    currency: string
    transaction_date: string
    description: string
    payment_method: 'cash' | 'card' | 'transfer' | 'other'
  }
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { data: business } = await supabase
    .from('businesses')
    .select('id, base_currency')
    .eq('user_id', user.id)
    .single()

  if (!business) return { error: 'Business not found' }

  const { data: existingEntry, error: fetchError } = await supabase
    .from('journal_entries')
    .select('id, business_id, transaction_date, description, status')
    .eq('id', journalEntryId)
    .eq('business_id', business.id)
    .single()

  if (fetchError || !existingEntry) return { error: 'Journal entry not found' }
  if (existingEntry.status === 'void') return { error: 'Cannot edit a voided transaction' }

  const { data: existingLines } = await supabase
    .from('journal_lines')
    .select('id, account_id, type, amount')
    .eq('journal_entry_id', journalEntryId)

  if (!existingLines?.length) return { error: 'Journal entry has no lines' }

  const { data: category } = await supabase
    .from('categories')
    .select('id, name, type')
    .eq('id', transaction.category_id)
    .single()

  if (!category) return { error: 'Category not found' }

  const cashAccountResult = await getAccountByName('Cash', business.id)
  const categoryAccountResult = await getAccountByName(category.name, business.id)

  if (cashAccountResult.error || !cashAccountResult.data) return { error: 'Cash account not found' }
  if (categoryAccountResult.error || !categoryAccountResult.data)
    return { error: `Account for category "${category.name}" not found` }

  const cashAccountId = cashAccountResult.data.id
  const categoryAccountId = categoryAccountResult.data.id

  // Update journal entry header
  const { error: updateEntryError } = await supabase
    .from('journal_entries')
    .update({
      transaction_date: transaction.transaction_date,
      description: transaction.description,
    })
    .eq('id', journalEntryId)
    .eq('business_id', business.id)

  if (updateEntryError) {
    console.error('Error updating journal entry:', updateEntryError)
    return { error: 'Failed to update transaction' }
  }

  // Update each line: match by account (Cash vs category) and set new amount/account_id
  for (const line of existingLines) {
    const isCashLine = line.account_id === cashAccountId
    const newAccountId = isCashLine ? cashAccountId : categoryAccountId
    const newType = isCashLine
      ? category.type === 'income'
        ? 'debit'
        : 'credit'
      : category.type === 'income'
        ? 'credit'
        : 'debit'
    const { error: lineError } = await supabase
      .from('journal_lines')
      .update({ account_id: newAccountId, type: newType, amount: transaction.amount })
      .eq('id', line.id)

    if (lineError) {
      console.error('Error updating journal line:', lineError)
      return { error: 'Failed to update transaction lines' }
    }
  }

  return { data: { id: journalEntryId } }
}

export async function getJournalEntries(filters?: {
  // Filters can be added here later
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!business) {
    return { error: 'Business not found' }
  }

  // Fetch entries with lines; use separate account fetch so journal_lines.type (debit/credit)
  // is not overwritten by accounts.type (asset/expense) in the response.
  const { data: entriesData, error } = await supabase
    .from('journal_entries')
    .select('*, journal_lines(*)')
    .eq('business_id', business.id)
    .order('transaction_date', { ascending: false })

  if (error) {
    return { error: error.message }
  }

  if (!entriesData?.length) {
    return { data: entriesData ?? [] }
  }

  // Get all unique account IDs and fetch account names/types
  const accountIds = new Set<string>()
  entriesData.forEach((entry: any) => {
    entry.journal_lines?.forEach((line: any) => {
      if (line.account_id) accountIds.add(line.account_id)
    })
  })

  const { data: accountsData } = await supabase
    .from('accounts')
    .select('id, name, type')
    .in('id', Array.from(accountIds))

  const accountsMap = new Map(
    (accountsData ?? []).map((a: any) => [a.id, { name: a.name, type: a.type }])
  )

  // Attach account info to each line; keep journal line's type as line_type (debit/credit).
  const data = entriesData.map((entry: any) => ({
    ...entry,
    journal_lines: (entry.journal_lines ?? []).map((line: any) => ({
      ...line,
      line_type: line.type, // debit | credit from journal_lines
      account: accountsMap.get(line.account_id) ?? { name: 'Unknown', type: 'expense' },
    })),
  }))

  return { data }
}

export async function voidJournalEntry(journalEntryId: string) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { error: "Not authenticated" }

    const { data: business } = await supabase
        .from("businesses")
        .select("id")
        .eq("user_id", user.id)
        .single()

    if (!business) return { error: "Business not found" }

    // 1. Get the original entry
    const { data: originalEntry, error: fetchError } = await supabase
        .from("journal_entries")
        .select("*, journal_lines(*)")
        .eq("id", journalEntryId)
        .eq("business_id", business.id)
        .single()

    if (fetchError || !originalEntry) {
        return { error: "Original journal entry not found." }
    }

    if (originalEntry.status === 'void') {
        return { error: "Entry is already voided."}
    }

    // 2. Create a reversing journal entry
    const reversingLines = originalEntry.journal_lines.map(line => ({
        account_id: line.account_id,
        type: line.type === 'debit' ? 'credit' : 'debit', // Reverse the type
        amount: line.amount,
    }))

    const reversingEntry = {
        business_id: business.id,
        transaction_date: new Date().toISOString().split('T')[0], // Today's date for voiding
        description: `Reversal of: ${originalEntry.description}`,
        lines: reversingLines,
    }

    const { error: creationError } = await createJournalEntry(reversingEntry)

    if (creationError) {
        return { error: `Failed to create reversing entry: ${creationError.error}` }
    }

    // 3. Update the status of the original entry to 'void'
    const { error: updateError } = await supabase
        .from("journal_entries")
        .update({ status: 'void' })
        .eq("id", journalEntryId)

    if (updateError) {
        // This is tricky. The reversing entry was created, but we failed to mark the original as void.
        // This requires more robust error handling, but for now we'll just report it.
        console.error("Critical error: Failed to mark original entry as void after creating reversal.", updateError)
        return { error: "Failed to update original entry status. Manual correction needed." }
    }

    return { success: true }
}
