import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getDashboardData } from '@/lib/actions/dashboard'
import { getBusiness } from '@/lib/actions/business'
import DashboardStats from '@/components/DashboardStats'
import ExpenseBreakdown from '@/components/ExpenseBreakdown'
import RecentTransactions from '@/components/RecentTransactions'
import DashboardCharts from '@/components/DashboardCharts'
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout'
import { AppHeader } from '@/components/layout/AppHeader'

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
    return (
      <AuthenticatedLayout>
        <div className="p-6">Error loading dashboard</div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <AppHeader
        title="Dashboard"
        subtitle="Overview of your business finances"
      />
      <div className="p-8 space-y-8 bg-background/50">
        <DashboardStats data={dashboardData} />

        <DashboardCharts
          income={dashboardData.income}
          expenses={dashboardData.expenses}
          profit={dashboardData.profit}
          currency={dashboardData.currency}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ExpenseBreakdown data={dashboardData.expenseBreakdown} />
          <RecentTransactions />
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
