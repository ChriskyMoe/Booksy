import { getTransactions } from '@/lib/actions/transactions'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function RecentTransactions() {
  const result = await getTransactions()
  const transactions = result.data?.slice(0, 5) || []

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <Link
          href="/transactions"
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          View all
        </Link>
      </div>
      <div className="mt-4 space-y-3">
        {transactions.length === 0 ? (
          <p className="text-sm text-gray-500">No transactions yet</p>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {transaction.category?.name || 'Uncategorized'}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(transaction.transaction_date)}
                  {transaction.client_vendor && ` • ${transaction.client_vendor}`}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    transaction.category?.type === 'income'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {transaction.category?.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.base_amount, transaction.currency)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
