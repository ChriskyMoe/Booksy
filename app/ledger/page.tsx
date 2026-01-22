import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBusiness } from '@/lib/actions/business'
import LedgerView from '@/components/LedgerView'
import LogoutButton from '@/components/LogoutButton'
import Link from 'next/link'

export default async function LedgerPage() {
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
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Transactions
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Ledger</h2>
          <p className="mt-2 text-gray-600">View all transactions with filters</p>
        </div>

        <LedgerView />
      </main>
    </div>
  )
}
