'use server'

import { createClient } from '@/lib/supabase/server'

export async function getJournalEntries() {
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

  const businessId = (business as { id: string }).id
  const { data: entriesData, error } = await (supabase as any)
    .from('journal_entries')
    .select('*, journal_lines(*)')
    .eq('business_id', businessId)
    .order('transaction_date', { ascending: false })

  if (error) {
    return { error: error.message }
  }

  if (!entriesData?.length) {
    return { data: entriesData ?? [] }
  }

  const accountIds = new Set<string>()
  entriesData.forEach((entry: any) => {
    entry.journal_lines?.forEach((line: any) => {
      if (line.account_id) accountIds.add(line.account_id)
    })
  })

  const { data: accountsData } = await (supabase as any)
    .from('accounts')
    .select('id, name, type')
    .in('id', Array.from(accountIds))

  const accountsMap = new Map(
    (accountsData ?? []).map((a: any) => [a.id, { name: a.name, type: a.type }])
  )

  const data = entriesData.map((entry: any) => ({
    ...entry,
    journal_lines: (entry.journal_lines ?? []).map((line: any) => ({
      ...line,
      line_type: line.type,
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

  if (!user) return { error: 'Not authenticated' }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!business) return { error: 'Business not found' }

  const businessId = (business as { id: string }).id
  const { data: originalEntry, error: fetchError } = await (supabase as any)
    .from('journal_entries')
    .select('*, journal_lines(*)')
    .eq('id', journalEntryId)
    .eq('business_id', businessId)
    .single()

  if (fetchError || !originalEntry) {
    return { error: 'Original journal entry not found.' }
  }

  if (originalEntry.status === 'void') {
    return { error: 'Entry is already voided.' }
  }

  const { error: updateError } = await (supabase as any)
    .from('journal_entries')
    .update({ status: 'void' })
    .eq('id', journalEntryId)

  if (updateError) {
    console.error('Failed to mark original entry as void.', updateError)
    return { error: 'Failed to update entry status.' }
  }

  return { success: true }
}

/**
 * Create a journal entry (and ledger rows) when a transaction is created.
 * Ensures the Ledger shows a new row whenever a Transaction row is made.
 */
export async function createJournalEntryFromTransaction(params: {
  business_id: string
  transaction_date: string
  description: string
  category_name: string
  category_type: 'income' | 'expense'
  amount: number
}) {
  const supabase = await createClient()
  const { business_id, transaction_date, description, category_name, category_type, amount } =
    params

  if (!amount || amount <= 0) {
    return { error: 'Amount must be positive' }
  }

  // 1. Get or create Cash account
  const { data: cashRows } = await (supabase as any)
    .from('accounts')
    .select('id')
    .eq('business_id', business_id)
    .eq('name', 'Cash')
    .limit(1)

  let cashAccountId: string
  if (cashRows?.length) {
    cashAccountId = cashRows[0].id
  } else {
    const { data: newCash, error: cashErr } = await (supabase as any)
      .from('accounts')
      .insert({
        business_id,
        name: 'Cash',
        type: 'asset',
      })
      .select('id')
      .single()
    if (cashErr || !newCash) {
      console.error('Could not create Cash account:', cashErr)
      return { error: 'Cash account not found. Please add a Cash account in Setup.' }
    }
    cashAccountId = newCash.id
  }

  // 2. Get or create category account (same name as category)
  const accountType = category_type === 'income' ? 'revenue' : 'expense'
  const { data: categoryRows } = await (supabase as any)
    .from('accounts')
    .select('id')
    .eq('business_id', business_id)
    .eq('name', category_name)
    .limit(1)

  let categoryAccountId: string
  if (categoryRows?.length) {
    categoryAccountId = categoryRows[0].id
  } else {
    const { data: newAccount, error: accErr } = await (supabase as any)
      .from('accounts')
      .insert({
        business_id,
        name: category_name,
        type: accountType,
      })
      .select('id')
      .single()
    if (accErr || !newAccount) {
      console.error('Could not create category account:', accErr)
      return { error: `Could not create account for category "${category_name}".` }
    }
    categoryAccountId = newAccount.id
  }

  // 3. Build double-entry lines: income = Cash debit + category credit; expense = category debit + Cash credit
  const lines: { account_id: string; type: 'debit' | 'credit'; amount: number }[] =
    category_type === 'income'
      ? [
          { account_id: cashAccountId, type: 'debit', amount },
          { account_id: categoryAccountId, type: 'credit', amount },
        ]
      : [
          { account_id: categoryAccountId, type: 'debit', amount },
          { account_id: cashAccountId, type: 'credit', amount },
        ]

  // 4. Create journal entry header
  const { data: entry, error: entryError } = await (supabase as any)
    .from('journal_entries')
    .insert({
      business_id,
      transaction_date,
      description: description || 'Transaction',
    })
    .select('id')
    .single()

  if (entryError || !entry) {
    console.error('Could not create journal entry:', entryError)
    return { error: 'Failed to create ledger entry.' }
  }

  // 5. Create journal lines
  const linesToInsert = lines.map((line) => ({
    journal_entry_id: entry.id,
    account_id: line.account_id,
    type: line.type,
    amount: line.amount,
  }))

  const { error: linesError } = await (supabase as any)
    .from('journal_lines')
    .insert(linesToInsert)

  if (linesError) {
    console.error('Could not create journal lines:', linesError)
    await (supabase as any).from('journal_entries').delete().eq('id', entry.id)
    return { error: 'Failed to create ledger lines.' }
  }

  return { data: { id: entry.id } }
}
