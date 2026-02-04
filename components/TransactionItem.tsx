'use client'

import { formatCurrency, formatDate } from '@/lib/utils'
import { voidTransaction } from '@/lib/actions/transactions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface TransactionItemProps {
  transaction: {
    id: string
    transaction_date: string
    category: { name: string; type: 'income' | 'expense' } | null
    client_vendor: string | null
    payment_method: string
    base_amount: number
    currency: string
    status?: string
  }
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const router = useRouter()
  const [isVoiding, setIsVoiding] = useState(false)
  const isVoided = transaction.status === 'void'

  const handleVoid = async () => {
    if (
      !confirm(
        'Void this transaction? It will show as voided in the list and in the Ledger. Balance will be corrected; history remains.'
      )
    ) {
      return
    }
    setIsVoiding(true)
    const result = await voidTransaction(transaction.id)
    if (result.error) {
      alert(result.error)
      setIsVoiding(false)
    } else {
      router.refresh()
    }
  }

  return (
    <tr className={isVoiding ? 'opacity-50' : ''}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
        {formatDate(transaction.transaction_date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge
          variant={transaction.category?.type === 'income' ? 'default' : 'destructive'}
          className={
            transaction.category?.type === 'income'
              ? 'bg-success/10 text-success hover:bg-success/20'
              : ''
          }
        >
          {transaction.category?.name || 'Uncategorized'}
        </Badge>
        {isVoided && (
          <span className="ml-2 text-xs font-semibold text-destructive">(Void)</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
        {transaction.client_vendor || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground capitalize">
        {transaction.payment_method}
      </td>
      <td
        className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
          transaction.category?.type === 'income' ? 'text-success' : 'text-destructive'
        }`}
      >
        {transaction.category?.type === 'income' ? '+' : '-'}
        {formatCurrency(transaction.base_amount, transaction.currency)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {!isVoided && (
          <Button
            onClick={handleVoid}
            disabled={isVoiding}
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            Void
          </Button>
        )}
      </td>
    </tr>
  )
}
