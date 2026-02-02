import { getJournalEntries } from '@/lib/actions/journal'
import { formatCurrency, formatDate, processJournalForDisplay } from '@/lib/utils'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowRight } from 'lucide-react'

export default async function RecentTransactions() {
  const result = await getJournalEntries()
  const journalEntries = result.data?.slice(0, 5) || []
  const transactions = journalEntries.map(processJournalForDisplay)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/transactions">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions yet</p>
          ) : (
            transactions.map((transaction, index) => (
              <div key={transaction.id}>
                <div className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {transaction.accountName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        transaction.type === 'income'
                          ? 'text-success'
                          : 'text-destructive'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount, 'USD')}
                    </p>
                  </div>
                </div>
                {index < transactions.length - 1 && <Separator />}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
