import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBusiness } from '@/lib/actions/business'
import LogoutButton from '@/components/LogoutButton'

export default async function CurrencyConverter() {
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
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
                            📘 Booksy
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium text-gray-600 hover:text-gray-900"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/transactions"
                                className="text-sm font-medium text-gray-600 hover:text-gray-900"
                            >
                                Transactions
                            </Link>
                            <Link
                                href="/ledger"
                                className="text-sm font-medium text-gray-600 hover:text-gray-900"
                            >
                                Ledger
                            </Link>
                            <Link
                                href="/currency-converter"
                                className="text-sm font-medium text-blue-600 hover:text-blue-500"
                            >
                                Currency Converter
                            </Link>
                            <Link
                                href="/ai-assistant"
                                className="text-sm font-medium text-gray-600 hover:text-gray-900"
                            >
                                AI Assistant
                            </Link>
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Currency Converter</h1>
                        <p className="mt-2 text-gray-600">
                            Convert amounts between currencies (preview)
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                        <div className="space-y-8">
                            {/* From Currency */}
                            <div className="space-y-3">
                                <label htmlFor="from-currency" className="block text-sm font-medium text-gray-700">
                                    From Currency
                                </label>
                                <select
                                    id="from-currency"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                                    defaultValue="USD"
                                >
                                    <option value="USD">USD - US Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="GBP">GBP - British Pound</option>
                                    <option value="JPY">JPY - Japanese Yen</option>
                                    <option value="THB">THB - Thai Baht</option>
                                    <option value="MMK">MMK - Myanmar Kyat</option>
                                    <option value="SGD">SGD - Singapore Dollar</option>
                                    <option value="AUD">AUD - Australian Dollar</option>
                                    <option value="CAD">CAD - Canadian Dollar</option>
                                    <option value="CHF">CHF - Swiss Franc</option>
                                    <option value="CNY">CNY - Chinese Yuan</option>
                                    <option value="INR">INR - Indian Rupee</option>
                                </select>
                                <p className="text-sm text-gray-500">Select base currency</p>
                            </div>

                            {/* Amount Input */}
                            <div className="space-y-3">
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                    Amount
                                </label>
                                <input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                                />
                            </div>

                            {/* Swap Button */}
                            <div className="flex justify-center">
                                <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                                    <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                </button>
                            </div>

                            {/* To Currency */}
                            <div className="space-y-3">
                                <label htmlFor="to-currency" className="block text-sm font-medium text-gray-700">
                                    To Currency
                                </label>
                                <select
                                    id="to-currency"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                                    defaultValue="EUR"
                                >
                                    <option value="USD">USD - US Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="GBP">GBP - British Pound</option>
                                    <option value="JPY">JPY - Japanese Yen</option>
                                    <option value="THB">THB - Thai Baht</option>
                                    <option value="MMK">MMK - Myanmar Kyat</option>
                                    <option value="SGD">SGD - Singapore Dollar</option>
                                    <option value="AUD">AUD - Australian Dollar</option>
                                    <option value="CAD">CAD - Canadian Dollar</option>
                                    <option value="CHF">CHF - Swiss Franc</option>
                                    <option value="CNY">CNY - Chinese Yuan</option>
                                    <option value="INR">INR - Indian Rupee</option>
                                </select>
                                <p className="text-sm text-gray-500">Select target currency</p>
                            </div>

                            {/* Converted Amount Output */}
                            <div className="space-y-3">
                                <label htmlFor="converted-amount" className="block text-sm font-medium text-gray-700">
                                    Converted Amount
                                </label>
                                <input
                                    id="converted-amount"
                                    type="text"
                                    placeholder="0.00"
                                    disabled
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 placeholder-gray-400 cursor-not-allowed"
                                />
                            </div>

                            {/* Convert Button */}
                            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                Convert
                            </button>

                            {/* Bottom Note */}
                            <div className="text-center pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    Conversion rates are indicative only (preview)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
