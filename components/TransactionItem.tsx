'use client'

import { formatCurrency, formatDate } from '@/lib/utils'
import { deleteTransaction } from '@/lib/actions/transactions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface TransactionItemProps {
  transaction: {
    id: string
    transaction_date: string
    category: { name: string; type: 'income' | 'expense' } | null
    client_vendor: string | null
    payment_method: string
    base_amount: number
    currency: string
  }
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return
    }

    setIsDeleting(true)
    await deleteTransaction(transaction.id)
    router.refresh()
  }

  return (
    <tr className={isDeleting ? 'opacity-50' : ''}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDate(transaction.transaction_date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            transaction.category?.type === 'income'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {transaction.category?.name || 'Uncategorized'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {transaction.client_vendor || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
        {transaction.payment_method}
      </td>
      <td
        className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
          transaction.category?.type === 'income' ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {transaction.category?.type === 'income' ? '+' : '-'}
        {formatCurrency(transaction.base_amount, transaction.currency)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-900 disabled:opacity-50"
        >
          Delete
        </button>
      </td>
    </tr>
  )
}
