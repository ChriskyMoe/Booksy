import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardChartsProps {
  income: number
  expenses: number
  profit: number
  currency: string
}

export default function DashboardCharts({
  income,
  expenses,
  profit,
  currency,
}: DashboardChartsProps) {
  const maxValue = Math.max(income, expenses, Math.abs(profit), 1)

  const bars = [
    {
      label: 'Income',
      value: income,
      color: 'bg-chart-1',
    },
    {
      label: 'Expenses',
      value: expenses,
      color: 'bg-chart-2',
    },
    {
      label: 'Profit',
      value: profit,
      color: profit >= 0 ? 'bg-chart-3' : 'bg-destructive',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-56 items-end gap-6">
          {bars.map((bar) => {
            const height = (Math.abs(bar.value) / maxValue) * 100
            const formatted = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency,
            }).format(bar.value)

            return (
              <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end justify-center">
                  <div
                    className={`w-10 rounded-t-md ${bar.color} shadow-card`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <div className="text-xs font-medium text-muted-foreground">{bar.label}</div>
                <div className="text-xs font-semibold text-foreground">{formatted}</div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

