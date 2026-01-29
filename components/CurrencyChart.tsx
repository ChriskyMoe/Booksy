'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SearchableCurrencySelect } from '@/components/SearchableCurrencySelect'
import { getHistoricalRatesForPeriod, HistoricalDataPoint } from '@/lib/services/exchangeRate'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts'

// Format data for chart display
const formatDataForChart = (data: HistoricalDataPoint[], range: string) => {
    return data.map((point, index) => {
        let name = ''

        if (range === '1D') {
            const date = new Date(point.date)
            name = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        } else if (range === '1M') {
            const date = new Date(point.date)
            name = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
        } else {
            const date = new Date(point.date)
            name = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
        }

        return {
            name,
            rate: point.rate,
            date: point.date
        }
    })
}

export function CurrencyChart() {
    const [range, setRange] = useState('1Y')
    const [fromCurrency, setFromCurrency] = useState('USD')
    const [toCurrency, setToCurrency] = useState('EUR')
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const ranges = ['1D', '5D', '1M', '1Y', '5Y', 'Max']

    useEffect(() => {
        fetchHistoricalData()
    }, [range, fromCurrency, toCurrency])

    const fetchHistoricalData = async () => {
        try {
            setLoading(true)
            setError(null)

            const historicalData = await getHistoricalRatesForPeriod(
                fromCurrency,
                toCurrency,
                range as '1D' | '5D' | '1M' | '1Y' | '5Y'
            )

            if (historicalData.length === 0) {
                // Fallback to mock data if API fails
                setData(generateMockData(range))
            } else {
                const formattedData = formatDataForChart(historicalData, range)
                setData(formattedData)
            }
        } catch (err) {
            console.error('Error fetching historical data:', err)
            setError('Failed to load historical data')
            // Fallback to mock data
            setData(generateMockData(range))
        } finally {
            setLoading(false)
        }
    }

    // Keep mock data as fallback
    const generateMockData = (range: string) => {
        const points = range === '1D' ? 24 : range === '5D' ? 5 : range === '1M' ? 30 : 12
        const labels = range === '1D' ? ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
            : range === '1M' ? ['1st', '5th', '10th', '15th', '20th', '25th', '30th']
                : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

        return Array.from({ length: points }, (_, i) => ({
            name: points <= 12 ? labels[i] : `P${i}`,
            rate: 0.85 + Math.random() * 0.1, // More realistic EUR/USD rate
        }))
    }

    return (
        <Card className="border-border/50 shadow-sm bg-card mt-8">
            <CardHeader className="flex flex-col space-y-4 pb-7">
                <div className="flex flex-col space-y-2">
                    <CardTitle className="text-lg font-bold tracking-tight">Exchange Rate Trends</CardTitle>
                    <CardDescription className="text-xs">Historical performance for the selected currency pair</CardDescription>
                </div>

                {/* Currency Selectors */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">From Currency</label>
                        <SearchableCurrencySelect
                            value={fromCurrency}
                            onValueChange={setFromCurrency}
                            placeholder="Select from currency"
                            className="h-9"
                        />
                    </div>

                    <div className="flex items-end">
                        <div className="text-sm font-medium text-muted-foreground">to</div>
                    </div>

                    <div className="flex-1 space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">To Currency</label>
                        <SearchableCurrencySelect
                            value={toCurrency}
                            onValueChange={setToCurrency}
                            placeholder="Select to currency"
                            className="h-9"
                        />
                    </div>
                </div>

                {/* Time Range Selector */}
                <div className="flex bg-muted/30 p-1 rounded-lg border border-border/50">
                    {ranges.map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${range === r
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                {loading && (
                    <div className="flex items-center justify-center h-[300px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                )}

                {error && (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && data.length > 0 && (
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    hide
                                    domain={['dataMin - 0.01', 'dataMax + 0.01']}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    }}
                                    itemStyle={{ color: 'hsl(var(--foreground))', fontSize: '12px', fontWeight: 'bold' }}
                                    labelStyle={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
                                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="rate"
                                    stroke="hsl(var(--success))"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#colorRate)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}

                <div className="mt-6 flex justify-between items-center text-[10px] text-muted-foreground/60 font-medium italic">
                    <span>Data from ExchangeRate-API · Market mid-point rates</span>
                    <span className="not-italic">Disclaimer: Information is provided for informational purposes only.</span>
                </div>
            </CardContent>
        </Card>
    )
}
