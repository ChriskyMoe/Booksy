import { formatCurrency } from '@/lib/utils'

interface DashboardStatsProps {
  data: {
    income: number
    expenses: number
    profit: number
    cashBalance: number
    currency: string
  }
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="text-2xl">💰</div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Income</p>
            <p className="text-2xl font-semibold text-green-600">
              {formatCurrency(data.income, data.currency)}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="text-2xl">💸</div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Expenses</p>
            <p className="text-2xl font-semibold text-red-600">
              {formatCurrency(data.expenses, data.currency)}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="text-2xl">📈</div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Net Profit</p>
            <p
              className={`text-2xl font-semibold ${
                data.profit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatCurrency(data.profit, data.currency)}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="text-2xl">💵</div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Cash Balance</p>
            <p
              className={`text-2xl font-semibold ${
                data.cashBalance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatCurrency(data.cashBalance, data.currency)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
