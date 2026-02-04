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
