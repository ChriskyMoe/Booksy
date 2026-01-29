import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBusiness } from '@/lib/actions/business'
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout'
import { AppHeader } from '@/components/layout/AppHeader'
import CategoriesContent from '@/components/CategoriesContent'

export default async function CategoriesPage() {
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
                title="Categories"
                subtitle="Manage and track your income & expense sources"
            />
            <div className="p-6">
                <CategoriesContent />
            </div>
        </AuthenticatedLayout>
    )
}
