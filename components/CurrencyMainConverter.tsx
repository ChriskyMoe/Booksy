'use client'

import { useState, useEffect } from 'react'
import { getExchangeRates, convertAmount } from '@/lib/services/exchangeRate'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SearchableCurrencySelect } from '@/components/SearchableCurrencySelect'
import { ArrowLeftRight, Loader2, Info } from 'lucide-react'
import { CurrencyChart } from './CurrencyChart'

// Map currency codes to symbols/flags placeholders
const CURRENCY_SYMBOLS: Record<string, string> = {
    THB: '฿', EUR: '€', USD: '$', GBP: '£', JPY: '¥', MMK: 'K', SGD: 'S$', AUD: 'A$', CAD: 'C$', CHF: 'Fr', CNY: '¥', INR: '₹'
}

export function CurrencyMainConverter() {
    const [fromCurrency, setFromCurrency] = useState('THB')
    const [toCurrency, setToCurrency] = useState('EUR')
    const [amount, setAmount] = useState('1')
    const [convertedAmount, setConvertedAmount] = useState('')
    const [rates, setRates] = useState<Record<string, number>>({})
    const [loading, setLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState<string>('')

    useEffect(() => {
        fetchRates()
    }, [fromCurrency])

    useEffect(() => {
        if (rates && amount) {
            const converted = convertAmount(Number(amount), fromCurrency, toCurrency, rates)
            setConvertedAmount(converted.toFixed(4))
        } else {
            setConvertedAmount('')
        }
    }, [amount, fromCurrency, toCurrency, rates])

    const fetchRates = async () => {
        try {
            setLoading(true)
            const data = await getExchangeRates(fromCurrency)
            setRates(data.conversion_rates)
            setLastUpdated(new Date().toUTCString())
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSwap = () => {
        setFromCurrency(toCurrency)
        setToCurrency(fromCurrency)
        setAmount(convertedAmount || '1')
    }

    return (
        <Card className="border-border/50 shadow-elevated bg-card overflow-hidden">
            <CardContent className="p-8 md:p-10">
                {/* Large Display Header */}
                <div className="mb-10 text-center md:text-left">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                        1 {fromCurrency} =
                    </p>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
                        {rates[toCurrency] ? (1 / rates[fromCurrency] * rates[toCurrency]).toFixed(4) : '...'} {toCurrency}
                    </h2>
                    <div className="flex items-center justify-center md:justify-start gap-1.5 mt-3 text-xs text-muted-foreground/70">
                        <Info className="h-3 w-3" />
                        <span>Last updated · {lastUpdated || 'Loading...'}</span>
                    </div>
                </div>

                {/* Inputs Section */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-8">
                    {/* From Column */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground/80">From</Label>
                            <SearchableCurrencySelect
                                value={fromCurrency}
                                onValueChange={setFromCurrency}
                                placeholder="Select from currency"
                                className="h-14 text-base font-semibold border-border/50 bg-background/50 hover:bg-background transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground/80">Amount</Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground/50">
                                    {CURRENCY_SYMBOLS[fromCurrency] || ''}
                                </span>
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="h-14 pl-10 text-xl font-bold border-border/50 bg-background/30 focus-visible:ring-primary/20"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center md:pt-8">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleSwap}
                            className="h-12 w-12 rounded-full border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary transition-all active:scale-90"
                        >
                            <ArrowLeftRight className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* To Column */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground/80">To</Label>
                            <SearchableCurrencySelect
                                value={toCurrency}
                                onValueChange={setToCurrency}
                                placeholder="Select to currency"
                                className="h-14 text-base font-semibold border-border/50 bg-background/50 hover:bg-background transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground/80">Converted Amount</Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground/50">
                                    {CURRENCY_SYMBOLS[toCurrency] || ''}
                                </span>
                                <Input
                                    type="text"
                                    value={convertedAmount}
                                    readOnly
                                    className="h-14 pl-10 text-xl font-bold border-border/50 bg-muted/30 text-foreground cursor-default"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="flex items-center justify-center mt-8 text-primary animate-pulse">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        <span className="text-sm font-medium">Syncing live rates...</span>
                    </div>
                )}

                {/* Integrated Chart Section */}
                <div className="mt-12 pt-10 border-t border-border/40">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold tracking-tight text-foreground">Market Trends</h3>
                        <p className="text-xs text-muted-foreground">Real-time performance of {fromCurrency} to {toCurrency}</p>
                    </div>
                    <CurrencyChart
                        fromCurrency={fromCurrency}
                        toCurrency={toCurrency}
                        showControls={false}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
