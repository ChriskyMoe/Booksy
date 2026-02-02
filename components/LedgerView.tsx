'use client'

import { useState, useEffect, useMemo } from 'react'
import { getJournalEntries, voidJournalEntry } from '@/lib/actions/journal'
import { getCategories } from '@/lib/actions/categories'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from './ui/button'
import AddTransactionButton from './AddTransactionButton' // Import the button
import { Card, CardContent } from '@/components/ui/card' // Import Card for total balance display

// A type for the processed, display-friendly entry
type DisplayEntry = {
  id: string
  date: string
  description: string
  status: 'posted' | 'void' | 'draft'
  lines: {
    accountName: string
    debit: number
    credit: number
    type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  }[]
}

export default function LedgerView() {
  const [journalEntries, setJournalEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    const result = await getJournalEntries()

    if (result.error) {
      setError(result.error)
    } else if (result.data) {
      setJournalEntries(result.data)
    }
    setLoading(false)
  }

  const handleVoid = async (id: string) => {
    if (!confirm('Are you sure you want to void this entry? This will create a reversing entry and cannot be undone.')) {
      return
    }
    const result = await voidJournalEntry(id)
    if (result.error) {
      alert(`Failed to void entry: ${result.error}`)
    } else {
      // Refresh data to show the changes
      loadData()
    }
  }

  const processedEntries = useMemo((): DisplayEntry[] => {
    return journalEntries.map((entry) => ({
      id: entry.id,
      date: entry.transaction_date,
      description: entry.description,
      status: entry.status,
      lines: entry.journal_lines.map((line: any) => ({
        accountName: line.account?.name || 'Unknown',
        debit: line.type === 'debit' ? line.amount : 0,
        credit: line.type === 'credit' ? line.amount : 0,
        type: line.account?.type || 'expense',
      })),
    }))
  }, [journalEntries])

  const totalBalance = useMemo(() => {
    let balance = 0
    processedEntries.forEach(entry => {
      // Only consider non-voided entries for the total balance
      if (entry.status !== 'void') {
        entry.lines.forEach(line => {
          switch (line.type) {
            case 'asset':
            case 'expense':
              balance += (line.debit - line.credit)
              break
            case 'liability':
            case 'equity':
            case 'revenue':
              balance += (line.credit - line.debit)
              break
            default:
              // For unknown types, we might just ignore or log a warning
              break
          }
        })
      }
    })
    return balance
  }, [processedEntries])

  if (loading) {
    return <div className="text-center py-12">Loading ledger...</div>
  }
  
  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>
  }

  return (
    <div className="space-y-4">
      {/* Title and Action Buttons */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">General Ledger</h1>
        <div className="flex gap-2">
          <Button onClick={loadData} variant="outline" size="sm">Refresh</Button>
          <AddTransactionButton />
        </div>
      </div>

      {/* Total Balance Card */}
      <Card className="p-4">
        <CardContent className="flex justify-between items-center p-0">
          <h2 className="text-lg font-semibold text-foreground">Total Balance</h2>
          <p className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-success' : 'text-destructive'}`}>
            {formatCurrency(totalBalance, 'USD')}
          </p>
        </CardContent>
      </Card>

      {/* Journal Entries Table */}
      <div className="rounded-lg bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Account
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Debit
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Credit
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {processedEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">
                    No transactions found
                  </td>
                </tr>
              ) : (
                processedEntries.map((entry, entryIndex) => (
                  <>
                    {entry.lines.map((line, lineIndex) => (
                      <tr key={`${entry.id}-${lineIndex}`} className={`hover:bg-accent ${entry.status === 'void' ? 'bg-red-500/10 text-muted-foreground' : ''}`}>
                        {/* Show date and description only on the first line of an entry */}
                        {lineIndex === 0 ? (
                          <>
                            <td className="px-4 py-3 whitespace-nowrap text-sm row-span={entry.lines.length}">
                              {formatDate(entry.date)}
                            </td>
                            <td className="px-4 py-3 text-sm row-span={entry.lines.length}">
                                {entry.description}
                                {entry.status === 'void' && <span className="ml-2 text-xs font-semibold text-red-500">(VOID)</span>}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3"></td>
                            <td className="px-4 py-3"></td>
                          </>
                        )}
                        
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{line.accountName}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono">
                          {line.debit > 0 ? formatCurrency(line.debit, 'USD') : ''}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono">
                          {line.credit > 0 ? formatCurrency(line.credit, 'USD') : ''}
                        </td>

                        {/* Show actions only on the first line of an entry */}
                        {lineIndex === 0 ? (
                           <td className="px-4 py-3 text-center row-span={entry.lines.length}">
                             {entry.status !== 'void' && (
                               <Button
                                 variant="destructive"
                                 size="sm"
                                 onClick={() => handleVoid(entry.id)}
                               >
                                 Void
                               </Button>
                             )}
                           </td>
                        ) : (
                            <td className="px-4 py-3"></td>
                        )}
                      </tr>
                    ))}
                    {/* Separator line between entries */}
                    {entryIndex < processedEntries.length -1 && (
                      <tr>
                        <td colSpan={6} className="p-0 h-1 bg-border"></td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}