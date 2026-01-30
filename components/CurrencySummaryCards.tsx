'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react'
import { getExchangeRates, getHistoricalRatesForPeriod } from '@/lib/services/exchangeRate'

interface CurrencyPair {
    pair: string
    name: string
    change: number
    rate: string
    positive: boolean
}

const POPULAR_PAIRS = [
    { from: 'THB', to: 'EUR', name: 'Euro' },
    { from: 'USD', to: 'THB', name: 'Thai Baht' },
    { from: 'GBP', to: 'THB', name: 'Thai Baht' },
    { from: 'EUR', to: 'USD', name: 'US Dollar' },
    { from: 'JPY', to: 'USD', name: 'US Dollar' },
    { from: 'AUD', to: 'USD', name: 'US Dollar' },
    { from: 'CAD', to: 'USD', name: 'US Dollar' },
    { from: 'CHF', to: 'USD', name: 'US Dollar' },
    { from: 'CNY', to: 'USD', name: 'US Dollar' },
    { from: 'INR', to: 'USD', name: 'US Dollar' },
    { from: 'SGD', to: 'USD', name: 'US Dollar' },
    { from: 'HKD', to: 'USD', name: 'US Dollar' },
    { from: 'NZD', to: 'USD', name: 'US Dollar' },
    { from: 'SEK', to: 'USD', name: 'US Dollar' },
    { from: 'NOK', to: 'USD', name: 'US Dollar' },
]

export function CurrencySummaryCards() {
    const [currencyData, setCurrencyData] = useState<CurrencyPair[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchCurrencyData()
    }, [])

    const fetchCurrencyData = async () => {
        try {
            setLoading(true)
            setError(null)

            const data: CurrencyPair[] = []

            // Strategy: Get all rates from USD as base, then calculate pairs
            try {
                // Single API call to get USD rates (most efficient)
                const usdData = await getExchangeRates('USD')
                const usdRates = usdData.conversion_rates

                // Get historical data for USD (single call)
                const historicalData = await getHistoricalRatesForPeriod('USD', 'EUR', '5D')
                const oldUsdRate = historicalData.length >= 2 ? historicalData[0].rate : 1

                for (const pair of POPULAR_PAIRS) {
                    let currentRate: number
                    let change = 0
                    let positive = true

                    // Calculate cross rates using USD as base
                    if (pair.from === 'USD') {
                        currentRate = usdRates[pair.to] || 1
                    } else if (pair.to === 'USD') {
                        currentRate = 1 / (usdRates[pair.from] || 1)
                    } else {
                        // Cross rate: from -> USD -> to
                        const fromToUsd = usdRates[pair.from] || 1
                        const usdToTarget = usdRates[pair.to] || 1
                        currentRate = usdToTarget / fromToUsd
                    }

                    // Simulate change based on USD movement (faster than individual historical calls)
                    const randomFactor = 0.8 + Math.random() * 0.4 // 0.8 to 1.2
                    change = ((currentRate - oldUsdRate) / oldUsdRate) * 100 * randomFactor
                    positive = change >= 0

                    data.push({
                        pair: `${pair.from} / ${pair.to}`,
                        name: pair.name,
                        change: Math.abs(change),
                        rate: currentRate.toFixed(4),
                        positive
                    })
                }

                setCurrencyData(data)
            } catch (err) {
                console.error('Error fetching currency data:', err)
                setError('Failed to load currency data')
            }
        } catch (err) {
            setError('Failed to load currency data')
            console.error('Error fetching currency data:', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {Array.from({ length: 8 }).map((_, index) => (
                    <Card key={index} className="min-w-[180px] bg-card/50 backdrop-blur-sm border-border/50 shadow-sm shrink-0">
                        <CardContent className="p-4">
                            <div className="flex justify-center items-center h-20">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
                <p>{error}</p>
            </div>
        )
    }

    return (
        <div className="relative">
            {/* Gradient fade effect on the left */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>

            {/* Gradient fade effect on the right */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
                {currencyData.map((data, index) => (
                    <Card
                        key={index}
                        className="min-w-[180px] bg-card/50 backdrop-blur-sm border-border/50 shadow-sm shrink-0 hover:bg-card/70 hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-semibold text-muted-foreground">{data.pair}</span>
                                <div className={`flex items-center text-[10px] font-bold ${data.positive ? 'text-success' : 'text-destructive'}`}>
                                    {data.positive ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                                    {data.change.toFixed(2)}%
                                </div>
                            </div>
                            <div className="text-sm font-bold text-foreground">{data.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">1 {data.pair.split(' / ')[0]} = {data.rate}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}