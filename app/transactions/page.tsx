import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBusiness } from '@/lib/actions/business'
import TransactionList from '@/components/TransactionList'
import AddTransactionButton from '@/components/AddTransactionButton'
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout'
import { AppHeader } from '@/components/layout/AppHeader'

export default async function TransactionsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const businessResult = await getBusiness()
  if (businessResult.error || !businessResult.data) {
    redirect('/setup')
  }

  return (
    <AuthenticatedLayout>
      <AppHeader
        title="Transactions"
        subtitle="Manage your income and expenses"
      >
        <AddTransactionButton />
      </AppHeader>
      <div className="p-6">
        <TransactionList />
      </div>
    </AuthenticatedLayout>
  )
}
