import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBusiness } from '@/lib/actions/business'
import CurrencyConverter from '@/components/CurrencyConverter'
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout'
import { AppHeader } from '@/components/layout/AppHeader'

export default async function CurrencyConverterPage() {
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
        title="Currency Converter"
        subtitle="Convert amounts between currencies with real-time exchange rates"
      />
      <div className="p-6">
        <CurrencyConverter />
      </div>
    </AuthenticatedLayout>
  )
}
