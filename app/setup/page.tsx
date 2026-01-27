'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2 } from 'lucide-react'

const BUSINESS_TYPES = [
  'Retail',
  'Service',
  'Freelance',
  'E-commerce',
  'Restaurant',
  'Consulting',
  'Other',
]

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL']

export default function SetupPage() {
  const [formData, setFormData] = useState({
    name: '',
    businessType: '',
    baseCurrency: 'USD',
    fiscalYearStartMonth: 1,
    fiscalYearStartDay: 1,
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in')
      setLoading(false)
      return
    }

    // Create business
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .insert({
        user_id: user.id,
        name: formData.name,
        business_type: formData.businessType || null,
        base_currency: formData.baseCurrency,
        fiscal_year_start_month: formData.fiscalYearStartMonth,
        fiscal_year_start_day: formData.fiscalYearStartDay,
      })
      .select()
      .single()

    if (businessError) {
      setError(businessError.message)
      setLoading(false)
      return
    }

    // Create default categories
    const { error: categoryError } = await supabase.rpc('create_default_categories', {
      business_uuid: business.id,
    })

    if (categoryError) {
      console.error('Error creating default categories:', categoryError)
      // Continue anyway - categories can be created manually
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Set up your business</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Let's get started with some basic information about your business
          </p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 flex gap-3 items-start">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="space-y-6 rounded-xl border border-border bg-card p-8 shadow-card">
            {/* Business Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-semibold">
                Business Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="My Business"
                className="rounded-lg border-border h-11"
              />
            </div>

            {/* Business Type */}
            <div className="space-y-2">
              <Label htmlFor="businessType" className="text-base font-semibold">
                Business Type
              </Label>
              <select
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 h-11 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
              >
                <option value="">Select a type</option>
                {BUSINESS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Base Currency */}
            <div className="space-y-2">
              <Label htmlFor="baseCurrency" className="text-base font-semibold">
                Base Currency <span className="text-destructive">*</span>
              </Label>
              <select
                id="baseCurrency"
                name="baseCurrency"
                required
                value={formData.baseCurrency}
                onChange={(e) => setFormData({ ...formData, baseCurrency: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 h-11 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>

            {/* Fiscal Year Start Date */}
            <div className="space-y-3 pt-4">
              <Label className="text-base font-semibold">Fiscal Year Start Date</Label>
              <p className="text-sm text-muted-foreground">
                When does your business fiscal year begin? Most businesses use January 1st.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="fiscalYearStartMonth"
                    className="block text-sm font-medium text-foreground"
                  >
                    Month
                  </label>
                  <select
                    id="fiscalYearStartMonth"
                    name="fiscalYearStartMonth"
                    required
                    value={formData.fiscalYearStartMonth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fiscalYearStartMonth: parseInt(e.target.value),
                      })
                    }
                    className="block w-full rounded-lg border border-border bg-background px-4 py-2.5 h-11 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                  >
                    <option value={1}>January</option>
                    <option value={2}>February</option>
                    <option value={3}>March</option>
                    <option value={4}>April</option>
                    <option value={5}>May</option>
                    <option value={6}>June</option>
                    <option value={7}>July</option>
                    <option value={8}>August</option>
                    <option value={9}>September</option>
                    <option value={10}>October</option>
                    <option value={11}>November</option>
                    <option value={12}>December</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="fiscalYearStartDay"
                    className="block text-sm font-medium text-foreground"
                  >
                    Day
                  </label>
                  <Input
                    id="fiscalYearStartDay"
                    name="fiscalYearStartDay"
                    type="number"
                    min="1"
                    max="31"
                    required
                    value={formData.fiscalYearStartDay}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fiscalYearStartDay: parseInt(e.target.value),
                      })
                    }
                    className="rounded-lg border-border h-11"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full rounded-lg bg-gradient-to-r from-primary to-accent text-white font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              'Complete Setup'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
