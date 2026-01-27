import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Wallet, BarChart3, BrainCircuit, ArrowRight, Check } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <nav className="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto w-full" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Booksy</a>
          </div>
          <div className="lg:flex lg:flex-1 lg:justify-end">
            <Link href="/login">
              <Button
                variant="outline"
                className="rounded-lg px-6 py-2 text-sm font-semibold transition-all duration-200"
              >
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <div className="mx-auto max-w-6xl text-center py-20 sm:py-32 lg:py-40 px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 mb-6 border border-primary/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-primary">AI-Powered Financial Management</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Manage Your Business Finances with <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI Intelligence</span>
          </h1>
          
          <p className="mt-6 text-xl leading-8 text-muted-foreground max-w-2xl mx-auto">
            Track expenses, analyze income, and grow your business with AI-powered insights. No accounting expertise needed.
          </p>
          
          <div className="mt-12 flex items-center justify-center gap-x-6">
            <Link href="/signup">
              <Button
                size="lg"
                className="rounded-lg bg-gradient-to-r from-primary to-accent px-8 py-6 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
              >
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="rounded-lg px-8 py-6 font-semibold"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground">Everything you need to manage your business finances</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: 'Real-time Analytics',
                description: 'Track your income, expenses, and profit with beautiful visualizations and detailed insights.'
              },
              {
                icon: BrainCircuit,
                title: 'AI-Powered Insights',
                description: 'Get intelligent recommendations and analysis of your financial patterns and trends.'
              },
              {
                icon: Wallet,
                title: 'Smart Expense Tracking',
                description: 'Categorize and track all your business expenses with multi-currency support.'
              }
            ].map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="bg-card border border-border rounded-xl p-8 shadow-card hover:shadow-elevated transition-all duration-200 hover:-translate-y-1">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-32">
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-12 md:p-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-12">Why Choose Booksy?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                'No accounting experience required',
                'Secure cloud-based storage',
                'Multi-currency support',
                'AI-powered expense analysis',
                'Beautiful, intuitive interface',
                'Real-time financial reports'
              ].map((benefit) => (
                <div key={benefit} className="flex items-start gap-4">
                  <div className="h-6 w-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="h-4 w-4 text-success" />
                  </div>
                  <p className="text-lg font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-32 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">Start tracking your finances today and make smarter business decisions with AI insights.</p>
          
          <Link href="/signup">
            <Button
              size="lg"
              className="rounded-lg bg-gradient-to-r from-primary to-accent px-10 py-6 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
            >
              Start Free Trial Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2026 Booksy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
