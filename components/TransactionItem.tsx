'use client'

import { formatCurrency, formatDate } from '@/lib/utils'
import { voidJournalEntry } from '@/lib/actions/journal' // Use voidJournalEntry
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface DisplayTransaction {
  id: string
  date: string
  description: string
  accountName: string
  type: 'income' | 'expense'
  amount: number
}

interface TransactionItemProps {
  displayTransaction: DisplayTransaction
  onEdit?: (t: DisplayTransaction) => void
}

export default function TransactionItem({ displayTransaction, onEdit }: TransactionItemProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to void this transaction? This will create a reversing entry.')) {
      return
    }

    setIsDeleting(true)
    const result = await voidJournalEntry(displayTransaction.id) // Use voidJournalEntry
    if (result.error) {
      alert(`Failed to void transaction: ${result.error}`)
      setIsDeleting(false) // Re-enable button if voiding fails
    } else {
      router.refresh()
    }
  }

  return (
    <tr className={isDeleting ? 'opacity-50' : ''}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
        {formatDate(displayTransaction.date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge
          variant={displayTransaction.type === 'income' ? 'default' : 'destructive'}
          className={
            displayTransaction.type === 'income'
              ? 'bg-success/10 text-success hover:bg-success/20'
              : ''
          }
        >
          {displayTransaction.accountName || 'Uncategorized'}
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
        {displayTransaction.description || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground capitalize">
        {/* Payment method is no longer directly on processed transactions */}
        -
      </td>
      <td
        className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
          displayTransaction.type === 'income' ? 'text-success' : 'text-destructive'
        }`}
      >
        {displayTransaction.type === 'income' ? '+' : '-'}
        {formatCurrency(displayTransaction.amount, 'USD')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <span className="flex items-center justify-end gap-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => onEdit(displayTransaction)}
            >
              Edit
            </Button>
          )}
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            Void
          </Button>
        </span>
      </td>
    </tr>
  )
}
