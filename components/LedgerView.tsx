'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { getJournalEntries, voidJournalEntry } from '@/lib/actions/journal'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from './ui/button'
import { Card, CardContent } from '@/components/ui/card'

type DisplayLine = {
  accountName: string
  debit: number
  credit: number
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
}

type DisplayEntry = {
  id: string
  date: string
  description: string
  status: 'posted' | 'void' | 'draft'
  lines: DisplayLine[]
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
    if (
      !confirm(
        'Are you sure you want to void this transaction? This will create a reversing entry and cannot be undone.'
      )
    ) {
      return
    }
    const result = await voidJournalEntry(id)
    if (result.error) {
      alert(`Failed to void: ${result.error}`)
    } else {
      loadData()
    }
  }

  const processedEntries = useMemo((): DisplayEntry[] => {
    return journalEntries.map((entry) => ({
      id: entry.id,
      date: entry.transaction_date,
      description: entry.description,
      status: entry.status ?? 'posted',
      lines: (entry.journal_lines ?? []).map((line: any) => {
        const lineDirection = line.line_type ?? line.type
        const amount = Number(line.amount) ?? 0
        return {
          accountName: line.account?.name || 'Unknown',
          debit: lineDirection === 'debit' ? amount : 0,
          credit: lineDirection === 'credit' ? amount : 0,
          type: (line.account?.type || 'expense') as DisplayLine['type'],
        }
      }),
    }))
  }, [journalEntries])

  const totalBalance = useMemo(() => {
    let balance = 0
    processedEntries.forEach((entry) => {
      if (entry.status !== 'void') {
        entry.lines.forEach((line) => {
          if (line.type === 'asset') {
            balance += line.debit - line.credit
          }
        })
      }
    })
    return balance
  }, [processedEntries])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }
  if (error) {
    return <div className="text-center py-12 text-destructive">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Ledger</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={loadData} variant="outline" size="sm">
            Refresh
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/transactions">Add transaction →</Link>
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <CardContent className="flex justify-between items-center p-0">
          <h2 className="text-lg font-semibold text-foreground">Cash balance</h2>
          <p
            className={`text-2xl font-bold ${
              totalBalance >= 0 ? 'text-success' : 'text-destructive'
            }`}
          >
            {formatCurrency(totalBalance, 'USD')}
          </p>
        </CardContent>
      </Card>

      <LedgerTableView entries={processedEntries} onVoid={handleVoid} />
    </div>
  )
}

function LedgerTableView({
  entries,
  onVoid,
}: {
  entries: DisplayEntry[]
  onVoid: (entryId: string) => void
}) {
  const isCash = (accountName: string) => accountName === 'Cash'

  return (
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
            {entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">
                  No ledger entries yet
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <React.Fragment key={entry.id}>
                  {entry.lines.map((line, lineIdx) => {
                    const cashDebit = isCash(line.accountName) && line.debit > 0
                    const cashCredit = isCash(line.accountName) && line.credit > 0
                    const isFirst = lineIdx === 0
                    const isLast = lineIdx === entry.lines.length - 1
                    return (
                      <tr
                        key={`${entry.id}-${lineIdx}`}
                        className={`hover:bg-accent/50 ${
                          !isLast ? '' : 'border-b-2 border-border'
                        }`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                          {isFirst ? formatDate(entry.date) : ''}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {isFirst ? (
                            <>
                              {entry.description}
                              {entry.status === 'void' && (
                                <span className="ml-2 text-xs font-semibold text-destructive">
                                  (Void)
                                </span>
                              )}
                            </>
                          ) : (
                            ''
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">{line.accountName}</td>
                        <td className="px-4 py-3 text-right font-mono text-sm">
                          {line.debit > 0 ? (
                            <span
                              className={
                                cashDebit ? 'font-medium text-success' : 'text-foreground'
                              }
                            >
                              {cashDebit ? '+' : ''}
                              {formatCurrency(line.debit, 'USD')}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm">
                          {line.credit > 0 ? (
                            <span
                              className={
                                cashCredit ? 'font-medium text-destructive' : 'text-foreground'
                              }
                            >
                              {cashCredit ? '−' : ''}
                              {formatCurrency(line.credit, 'USD')}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isFirst && entry.status !== 'void' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => onVoid(entry.id)}
                            >
                              Void
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

