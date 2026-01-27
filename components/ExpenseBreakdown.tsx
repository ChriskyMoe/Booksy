import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ExpenseBreakdownProps {
  data: Record<string, number>
  currency?: string
}

export default function ExpenseBreakdown({ data, currency = 'USD' }: ExpenseBreakdownProps) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1])
  const total = Object.values(data).reduce((sum, val) => sum + val, 0)

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No expenses recorded yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.map(([category, amount]) => {
            const percentage = total > 0 ? (amount / total) * 100 : 0
            return (
              <div key={category}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-foreground">{category}</span>
                  <span className="text-foreground font-semibold">{formatCurrency(amount, currency)}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{percentage.toFixed(1)}%</div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
