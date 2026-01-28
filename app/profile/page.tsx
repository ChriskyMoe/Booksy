import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBusiness, updateBusiness, deleteBusiness } from '@/lib/actions/business'
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout'
import { AppHeader } from '@/components/layout/AppHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import "server-only";

export default async function ProfilePage() {
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

  const business = businessResult.data;

  async function handleUpdate(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const business_type = formData.get('business_type') as string
    await updateBusiness({ name, business_type })
    redirect('/profile?message=Profile updated successfully')
  }

  async function handleDelete(formData: FormData) {
    'use server'
    await deleteBusiness()
    redirect('/setup?message=Business deleted')
  }

  return (
    <AuthenticatedLayout>
      <AppHeader
        title="Profile"
        subtitle="Manage your business and account details"
      />
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <div className="rounded-lg bg-card border border-border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Business Details</h3>
          <form action={handleUpdate} className="space-y-4">
            <div>
              <Label htmlFor="name">Business Name</Label>
              <Input id="name" name="name" defaultValue={business.name} required />
            </div>
            <div>
              <Label htmlFor="business_type">Business Type</Label>
              <Input id="business_type" name="business_type" defaultValue={business.business_type || ''} placeholder="e.g., SaaS, E-commerce, Freelancer" />
            </div>
            <div>
              <Label htmlFor="email">Account Email</Label>
              <Input id="email" name="email" value={user.email} readOnly disabled />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </div>

        <div className="rounded-lg bg-destructive/10 border border-destructive/50 p-6">
          <h3 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h3>
          <p className="text-sm text-destructive-foreground mb-4">
            Deleting your business is a permanent action and cannot be undone. This will delete all associated data, including transactions, categories, and AI insights.
          </p>
           <form action={handleDelete}>
              <Button variant="destructive">Delete Business</Button>
            </form>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
