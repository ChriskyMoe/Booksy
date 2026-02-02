import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBusiness } from '@/lib/actions/business'
import TransactionsContent from '@/components/TransactionsContent'
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout'

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
      <TransactionsContent />
    </AuthenticatedLayout>
  )
}
