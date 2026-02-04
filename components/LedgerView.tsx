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

  // Total income (Cash debits) and total expense (Cash credits) from ledger, non-void only
  const { totalIncome, totalExpense, totalCashBalance } = useMemo(() => {
    let income = 0
    let expense = 0
    processedEntries.forEach((entry) => {
      if (entry.status !== 'void') {
        entry.lines.forEach((line) => {
          if (line.type === 'asset' && line.accountName === 'Cash') {
            income += line.debit
            expense += line.credit
          }
        })
      }
    })
    return {
      totalIncome: income,
      totalExpense: expense,
      totalCashBalance: income - expense,
    }
  }, [processedEntries])

  // Ledger order: oldest first (chronological), so running balance counts from the top
  const entriesChronological = useMemo(() => {
    return [...processedEntries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }, [processedEntries])

  // Running balance: recalculated from oldest to newest (top to bottom). Each row = balance after that transaction.
  const runningBalanceByEntryId = useMemo(() => {
    const map = new Map<string, number>()
    let running = 0
    entriesChronological.forEach((entry) => {
      if (entry.status !== 'void') {
        entry.lines.forEach((line) => {
          if (line.type === 'asset' && line.accountName === 'Cash') {
            running += line.debit - line.credit
          }
        })
      }
      map.set(entry.id, running)
    })
    return map
  }, [entriesChronological])

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
            <Link href="/transactions">Add transaction</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <CardContent className="p-0">
            <p className="text-sm font-medium text-muted-foreground">Total income</p>
            <p className="text-xl font-bold text-success mt-1">
              {formatCurrency(totalIncome, 'USD')}
            </p>
          </CardContent>
        </Card>
        <Card className="p-4">
          <CardContent className="p-0">
            <p className="text-sm font-medium text-muted-foreground">Total expense</p>
            <p className="text-xl font-bold text-destructive mt-1">
              {formatCurrency(totalExpense, 'USD')}
            </p>
          </CardContent>
        </Card>
        <Card className="p-4">
          <CardContent className="p-0">
            <p className="text-sm font-medium text-muted-foreground">Total balance</p>
            <p
              className={`text-xl font-bold mt-1 ${
                totalCashBalance >= 0 ? 'text-success' : 'text-destructive'
              }`}
            >
              {formatCurrency(totalCashBalance, 'USD')}
            </p>
          </CardContent>
        </Card>
      </div>

      <LedgerTableView
        entries={[...entriesChronological].reverse()}
        runningBalanceByEntryId={runningBalanceByEntryId}
        onVoid={handleVoid}
      />
    </div>
  )
}

function LedgerTableView({
  entries,
  runningBalanceByEntryId,
  onVoid,
}: {
  entries: DisplayEntry[]
  runningBalanceByEntryId: Map<string, number>
  onVoid: (entryId: string) => void
}) {
  const isCash = (accountName: string) => accountName === 'Cash'
  // Cash debit = inflow (green); Cash credit = outflow (red). Revenue credit = income (green); Expense debit = expense (red).
  const debitIsIncome = (line: DisplayLine) => isCash(line.accountName) && line.debit > 0
  const debitIsExpense = (line: DisplayLine) => line.type === 'expense' && line.debit > 0
  const creditIsIncome = (line: DisplayLine) => line.type === 'revenue' && line.credit > 0
  const creditIsExpense = (line: DisplayLine) => isCash(line.accountName) && line.credit > 0

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
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Running balance
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-muted-foreground">
                  No ledger entries yet
                </td>
              </tr>
            ) : (
              entries.map((entry) => {
                const runningBalance = runningBalanceByEntryId.get(entry.id) ?? 0
                return (
                  <React.Fragment key={entry.id}>
                    {entry.lines.map((line, lineIdx) => {
                      const debitGreen = debitIsIncome(line)
                      const debitRed = debitIsExpense(line)
                      const creditGreen = creditIsIncome(line)
                      const creditRed = creditIsExpense(line)
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
                                  debitGreen
                                    ? 'font-medium text-success'
                                    : debitRed
                                      ? 'font-medium text-destructive'
                                      : 'text-foreground'
                                }
                              >
                                {debitGreen ? '+' : ''}
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
                                  creditGreen
                                    ? 'font-medium text-success'
                                    : creditRed
                                      ? 'font-medium text-destructive'
                                      : 'text-foreground'
                                }
                              >
                                {creditRed ? '−' : ''}
                                {formatCurrency(line.credit, 'USD')}
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-sm font-medium">
                            <span
                              className={
                                runningBalance >= 0 ? 'text-success' : 'text-destructive'
                              }
                            >
                              {formatCurrency(runningBalance, 'USD')}
                            </span>
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
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
