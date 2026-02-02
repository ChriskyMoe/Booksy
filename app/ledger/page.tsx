import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBusiness } from '@/lib/actions/business'
import LedgerView from '@/components/LedgerView'
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout'
import { AppHeader } from '@/components/layout/AppHeader'

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
    <AuthenticatedLayout>
      <AppHeader
        title="Ledger"
        subtitle="Cash activity and ledger details (add or edit on Transactions)"
      />
      <div className="p-6">
        <LedgerView />
      </div>
    </AuthenticatedLayout>
  )
}
