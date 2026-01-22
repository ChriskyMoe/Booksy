import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBusiness } from '@/lib/actions/business'
import TransactionList from '@/components/TransactionList'
import AddTransactionButton from '@/components/AddTransactionButton'
import LogoutButton from '@/components/LogoutButton'
import Link from 'next/link'

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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
              📘 Booksy
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                href="/transactions"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Transactions
              </Link>
              <Link
                href="/ledger"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Ledger
              </Link>
              <Link
                href="/currency-converter"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Currency Converter
              </Link>
              <Link
                href="/ai-assistant"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                AI Assistant
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Transactions</h2>
            <p className="mt-2 text-gray-600">Manage your income and expenses</p>
          </div>
          <AddTransactionButton />
        </div>

        <TransactionList />
      </main>
    </div>
  )
}
