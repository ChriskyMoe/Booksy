import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getDashboardData } from '@/lib/actions/dashboard'
import { getBusiness } from '@/lib/actions/business'
import DashboardStats from '@/components/DashboardStats'
import ExpenseBreakdown from '@/components/ExpenseBreakdown'
import RecentTransactions from '@/components/RecentTransactions'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardPage() {
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

  const dashboardResult = await getDashboardData()
  const dashboardData = dashboardResult.data

  if (!dashboardData) {
    return <div>Error loading dashboard</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">📘 Booksy</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{businessResult.data.name}</span>
              <Link
                href="/transactions"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
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
                href="/ai-assistant"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                AI Financial Analysis
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="mt-2 text-gray-600">Overview of your business finances</p>
        </div>

        <DashboardStats data={dashboardData} />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ExpenseBreakdown data={dashboardData.expenseBreakdown} />
          <RecentTransactions />
        </div>
      </main>
    </div>
  )
}
