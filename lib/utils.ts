export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

// Helper to process journal entries into a simpler, displayable format
export function processJournalForDisplay(entry: any) {
  // Find the 'main' line of the transaction, which is typically not the Cash account
  const mainLine = entry.journal_lines.find(
    (line: any) => line.account?.name !== 'Cash'
  )
  
  if (!mainLine) {
    // Fallback for cash-to-cash transfers or unexpected entries
    const firstLine = entry.journal_lines[0]
    return {
      id: entry.id,
      date: entry.transaction_date,
      description: entry.description,
      accountName: firstLine.account?.name || 'Unknown',
      type: firstLine.account?.type || 'expense', // Default to expense if type is unknown
      amount: firstLine.amount,
    }
  }
  
  const lineDirection = mainLine.line_type ?? mainLine.type; // debit | credit from journal_lines
  const isDebit = lineDirection === 'debit';
  const accountType = mainLine.account?.type; // 'income', 'expense', 'asset', etc.
  
  let displayType: 'income' | 'expense' = 'expense';
  if (accountType === 'revenue') {
      displayType = 'income';
  } else if (accountType === 'asset' && !isDebit) { // e.g., decrease in accounts receivable (credit) or cash (credit) which acts like income
      displayType = 'income'; 
  } else if (accountType === 'liability' && isDebit) { // e.g., paying down a liability (debit) which acts like income (less outflow)
      displayType = 'income'; 
  } else if (accountType === 'asset' && isDebit) { // e.g., increase in cash (debit) from an expense
      displayType = 'expense'; // Could be an expense or an asset increase that reduces another asset
  } else if (accountType === 'liability' && !isDebit) { // e.g., increase in accounts payable (credit) from an expense
      displayType = 'expense';
  }
  // For 'equity' accounts, the classification depends on the specific transaction (e.g., owner's draw vs. capital contribution)
  // For simplicity, we'll try to infer from the main line, but it might need more sophisticated logic for complex cases.

  return {
    id: entry.id,
    date: entry.transaction_date,
    description: entry.description,
    accountName: mainLine.account?.name || 'Unknown',
    type: displayType,
    amount: mainLine.amount,
  }
}
