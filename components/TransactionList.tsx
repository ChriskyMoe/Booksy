import { getJournalEntries } from '@/lib/actions/journal'
import { processJournalForDisplay } from '@/lib/utils'
import TransactionItem from './TransactionItem'
import { Card, CardContent } from '@/components/ui/card'

export default async function TransactionList() {
  const result = await getJournalEntries()
  const journalEntries = result.data || []
  
  // Map journal entries to the simplified display format
  const displayTransactions = journalEntries
    .filter(entry => entry.status !== 'void') // Only show non-voided transactions
    .map(processJournalForDisplay)

  if (displayTransactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <h3 className="text-lg font-semibold text-foreground">No transactions yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Start tracking your income and expenses by adding your first transaction
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Payment Method
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {displayTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} displayTransaction={transaction} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
