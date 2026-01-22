import { getTransactions } from '@/lib/actions/transactions'
import { formatCurrency, formatDate } from '@/lib/utils'
import TransactionItem from './TransactionItem'

export default async function TransactionList() {
  const result = await getTransactions()
  const transactions = result.data || []

  if (transactions.length === 0) {
    return (
      <div className="rounded-lg bg-white p-12 text-center shadow-sm">
        <div className="text-4xl mb-4">📝</div>
        <h3 className="text-lg font-semibold text-gray-900">No transactions yet</h3>
        <p className="mt-2 text-sm text-gray-500">
          Start tracking your income and expenses by adding your first transaction
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Client/Vendor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Payment Method
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
