import { formatCurrency } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react'

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
  const stats = [
    {
      label: 'Total Income',
      value: formatCurrency(data.income, data.currency),
      icon: TrendingUp,
      className: 'text-success',
      iconBg: 'bg-success/10 border border-success/30',
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(data.expenses, data.currency),
      icon: TrendingDown,
      className: 'text-destructive',
      iconBg: 'bg-destructive/10 border border-destructive/30',
    },
    {
      label: 'Net Profit',
      value: formatCurrency(data.profit, data.currency),
      icon: data.profit >= 0 ? TrendingUp : TrendingDown,
      className: data.profit >= 0 ? 'text-success' : 'text-destructive',
      iconBg: data.profit >= 0 ? 'bg-success/10 border border-success/30' : 'bg-destructive/10 border border-destructive/30',
    },
    {
      label: 'Cash Balance',
      value: formatCurrency(data.cashBalance, data.currency),
      icon: Wallet,
      className: data.cashBalance >= 0 ? 'text-primary' : 'text-destructive',
      iconBg: data.cashBalance >= 0 ? 'bg-primary/10 border border-primary/30' : 'bg-destructive/10 border border-destructive/30',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold mt-2 ${stat.className}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`h-14 w-14 rounded-xl ${stat.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-7 w-7 ${stat.className}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
