import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Wallet, BarChart3, BrainCircuit } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white bg-gradient-to-br from-blue-500/20 via-indigo-700/20 to-purple-900/20 overflow-x-hidden">
      <div className="relative isolate">
        <header className="absolute inset-x-0 top-0 z-50">
          <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div className="flex lg:flex-1">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="text-2xl font-bold tracking-tighter text-white">Booksy</span>
              </a>
            </div>
            <div className="lg:flex lg:flex-1 lg:justify-end">
              <Link href="/login">
                <Button
                  className="rounded-full bg-white/10 px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-white/20"
                >
                  Sign In <span aria-hidden="true">&rarr;</span>
                </Button>
              </Link>
            </div>
          </nav>
        </header>

        <main className="relative z-10">
          <div className="mx-auto max-w-2xl text-center py-32 sm:py-48 lg:py-56">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              AI-Powered Expense & Income Tracking
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Track your business finances effortlessly and understand your financial health with AI-powered insights — no accounting expertise required.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/signup">
                <Button
                  className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-12 py-4 text-white font-bold shadow-[0_4px_14px_0_rgb(0,118,255,39%)] transition-all duration-150 hover:shadow-[0_6px_20px_0_rgb(0,118,255,23%)] hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500"
                >
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </div>

          <div className="pb-32 sm:pb-48 lg:pb-56">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <FeatureCard
                  icon={<Wallet className="h-8 w-8 text-blue-400" />}
                  title="Simple Bookkeeping"
                  description="Record income and expenses with ease. No complex accounting knowledge needed."
                />
                <FeatureCard
                  icon={<BarChart3 className="h-8 w-8 text-blue-400" />}
                  title="Clear Visibility"
                  description="Understand your financial health at a glance with intuitive dashboards."
                />
                <FeatureCard
                  icon={<BrainCircuit className="h-8 w-8 text-blue-400" />}
                  title="AI Insights"
                  description="Get clear, actionable financial insights powered by AI — no jargon."
                />
              </div>
            </div>
          </div>
        </main>
      </div>
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <p className="text-center text-xs leading-5 text-slate-400">
            &copy; {new Date().getFullYear()} Booksy, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-blue-500/20 hover:-translate-y-1">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="text-slate-300">{description}</p>
    </div>
  )
}
