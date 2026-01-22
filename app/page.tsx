import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-4xl text-center">
        <h1 className="mb-6 text-5xl font-bold text-gray-900 sm:text-6xl">
          📘 Booksy
        </h1>
        <p className="mb-4 text-2xl font-semibold text-gray-700">
          AI-Powered Expense & Income Tracking
        </p>
        <p className="mb-12 text-lg text-gray-600">
          Track your business finances effortlessly and understand your financial health
          with AI-powered insights — no accounting expertise required.
        </p>

        <div className="mb-16 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 text-4xl">💸</div>
            <h3 className="mb-2 text-xl font-semibold">Simple Bookkeeping</h3>
            <p className="text-gray-600">
              Record income and expenses with ease. No complex accounting knowledge needed.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 text-4xl">📊</div>
            <h3 className="mb-2 text-xl font-semibold">Clear Visibility</h3>
            <p className="text-gray-600">
              Understand your financial health at a glance with intuitive dashboards.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 text-4xl">🤖</div>
            <h3 className="mb-2 text-xl font-semibold">AI Insights</h3>
            <p className="text-gray-600">
              Get clear, actionable financial insights powered by AI — no jargon.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="rounded-md bg-blue-600 px-8 py-3 text-lg font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded-md bg-white px-8 py-3 text-lg font-semibold text-gray-700 shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
