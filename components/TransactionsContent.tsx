'use client'

import { useState, useEffect } from 'react'
import { getJournalEntries } from '@/lib/actions/journal'
import { processJournalForDisplay } from '@/lib/utils'
import TransactionItem from './TransactionItem'
import TransactionModal, { DisplayTransactionForEdit } from './TransactionModal'
import { Card, CardContent } from '@/components/ui/card'
import { AppHeader } from '@/components/layout/AppHeader'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function TransactionsContent() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editTransaction, setEditTransaction] = useState<DisplayTransactionForEdit | null>(null)
  const [transactions, setTransactions] = useState<DisplayTransactionForEdit[]>([])
  const [loading, setLoading] = useState(true)

  const loadTransactions = async () => {
    const result = await getJournalEntries()
    const entries = result.data || []
    const display = entries
      .filter((e: any) => e.status !== 'void')
      .map((e: any) => processJournalForDisplay(e))
    setTransactions(display)
    setLoading(false)
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  const openAdd = () => {
    setEditTransaction(null)
    setModalOpen(true)
  }

  const openEdit = (t: DisplayTransactionForEdit) => {
    setEditTransaction(t)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditTransaction(null)
    loadTransactions()
  }

  return (
    <>
      <AppHeader
        title="Transactions"
        subtitle="Manage your income and expenses"
      >
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </AppHeader>
      <div className="p-6">
        {loading ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              Loading...
            </CardContent>
          </Card>
        ) : transactions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold text-foreground">No transactions yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Start tracking your income and expenses by adding your first transaction
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {transactions.map((transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      displayTransaction={transaction}
                      onEdit={openEdit}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
      <TransactionModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        editTransaction={editTransaction}
      />
    </>
  )
}
