import { formatCurrency } from '@/lib/utils'

interface ExpenseBreakdownProps {
  data: Record<string, number>
  currency?: string
}

export default function ExpenseBreakdown({ data, currency = 'USD' }: ExpenseBreakdownProps) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1])
  const total = Object.values(data).reduce((sum, val) => sum + val, 0)

  if (entries.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Expense Breakdown</h3>
        <p className="mt-4 text-sm text-gray-500">No expenses recorded yet</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Expense Breakdown</h3>
      <div className="mt-4 space-y-4">
        {entries.map(([category, amount]) => {
          const percentage = total > 0 ? (amount / total) * 100 : 0
          return (
            <div key={category}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{category}</span>
                <span className="text-gray-900">{formatCurrency(amount, currency)}</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-gray-500">{percentage.toFixed(1)}%</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
