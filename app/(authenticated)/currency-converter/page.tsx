'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getExchangeRates, convertAmount, SUPPORTED_CURRENCIES, CURRENCY_NAMES } from '@/lib/services/exchangeRate'

export default function CurrencyConverter() {
    const [fromCurrency, setFromCurrency] = useState('USD')
    const [toCurrency, setToCurrency] = useState('EUR')
    const [amount, setAmount] = useState('')
    const [convertedAmount, setConvertedAmount] = useState('')
    const [rates, setRates] = useState<Record<string, number>>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hasConverted, setHasConverted] = useState(false)

    useEffect(() => {
        fetchRates()
    }, [])

    const fetchRates = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await getExchangeRates(fromCurrency)
            setRates(data.conversion_rates)
        } catch (err) {
            setError('Failed to load exchange rates. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSwap = () => {
        setFromCurrency(toCurrency)
        setToCurrency(fromCurrency)
        setAmount(convertedAmount)
        setHasConverted(false)
        setConvertedAmount('')
    }

    const handleConvert = () => {
        if (rates && amount && !isNaN(Number(amount))) {
            const converted = convertAmount(Number(amount), fromCurrency, toCurrency, rates)
            setConvertedAmount(converted.toFixed(2))
            setHasConverted(true)
        }
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
                            Convert amounts between currencies with real-time exchange rates
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                        <div className="space-y-8">
                            {/* Loading State */}
                            {loading && (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <span className="ml-3 text-gray-600">Loading exchange rates...</span>
                                </div>
                            )}

                            {/* Error State */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-800">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form */}
                            {!loading && !error && (
                                <>
                                    {/* From Currency */}
                                    <div className="space-y-3">
                                        <label htmlFor="from-currency" className="block text-sm font-medium text-gray-700">
                                            From Currency
                                        </label>
                                        <select
                                            id="from-currency"
                                            value={fromCurrency}
                                            onChange={(e) => {
                                                setFromCurrency(e.target.value)
                                                setHasConverted(false)
                                                setConvertedAmount('')
                                            }}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                                        >
                                            {SUPPORTED_CURRENCIES.map(currency => (
                                                <option key={currency} value={currency}>
                                                    {currency} - {CURRENCY_NAMES[currency]}
                                                </option>
                                            ))}
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
                                            value={amount}
                                            onChange={(e) => {
                                                setAmount(e.target.value)
                                                setHasConverted(false)
                                                setConvertedAmount('')
                                            }}
                                            placeholder="0.00"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                                        />
                                    </div>

                                    {/* Swap Button */}
                                    <div className="flex justify-center">
                                        <button
                                            onClick={handleSwap}
                                            className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                        >
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
                                            value={toCurrency}
                                            onChange={(e) => {
                                                setToCurrency(e.target.value)
                                                setHasConverted(false)
                                                setConvertedAmount('')
                                            }}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                                        >
                                            {SUPPORTED_CURRENCIES.map(currency => (
                                                <option key={currency} value={currency}>
                                                    {currency} - {CURRENCY_NAMES[currency]}
                                                </option>
                                            ))}
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
                                            value={hasConverted ? convertedAmount : ''}
                                            readOnly
                                            placeholder={hasConverted ? '' : 'Click Convert to see result'}
                                            className={`w-full px-4 py-3 border rounded-lg placeholder-gray-400 cursor-not-allowed ${hasConverted
                                                    ? 'border-green-300 bg-green-50 text-gray-900'
                                                    : 'border-gray-300 bg-gray-50 text-gray-500'
                                                }`}
                                        />
                                        {hasConverted && (
                                            <p className="text-sm text-green-600 font-medium">
                                                ✓ Conversion completed
                                            </p>
                                        )}
                                    </div>

                                    {/* Convert Button */}
                                    <button
                                        onClick={handleConvert}
                                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Convert
                                    </button>
                                </>
                            )}

                            {/* Bottom Note */}
                            <div className="text-center pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    Exchange rates provided by ExchangeRate-API.com
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Rates are updated in real-time and may vary
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
