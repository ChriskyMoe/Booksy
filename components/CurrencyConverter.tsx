'use client'

import { useState, useEffect } from 'react'
import { getExchangeRates, convertAmount, SUPPORTED_CURRENCIES, CURRENCY_NAMES } from '@/lib/services/exchangeRate'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowUpDown, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

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
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardContent className="p-6 md:p-8">
                    <div className="space-y-6">
                        {/* Loading State */}
                        {loading && (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <span className="ml-3 text-muted-foreground">Loading exchange rates...</span>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                    <p className="text-sm text-destructive">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        {!loading && !error && (
                            <>
                                {/* From Currency */}
                                <div className="space-y-2">
                                    <Label htmlFor="from-currency">From Currency</Label>
                                    <Select value={fromCurrency} onValueChange={(value) => {
                                        setFromCurrency(value)
                                        setHasConverted(false)
                                        setConvertedAmount('')
                                    }}>
                                        <SelectTrigger id="from-currency">
                                            <SelectValue placeholder="Select base currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SUPPORTED_CURRENCIES.map(currency => (
                                                <SelectItem key={currency} value={currency}>
                                                    {currency} - {CURRENCY_NAMES[currency]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">Select base currency</p>
                                </div>

                                {/* Amount Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => {
                                            setAmount(e.target.value)
                                            setHasConverted(false)
                                            setConvertedAmount('')
                                        }}
                                        placeholder="0.00"
                                    />
                                </div>

                                {/* Swap Button */}
                                <div className="flex justify-center">
                                    <Button
                                        onClick={handleSwap}
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full"
                                    >
                                        <ArrowUpDown className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* To Currency */}
                                <div className="space-y-2">
                                    <Label htmlFor="to-currency">To Currency</Label>
                                    <Select value={toCurrency} onValueChange={(value) => {
                                        setToCurrency(value)
                                        setHasConverted(false)
                                        setConvertedAmount('')
                                    }}>
                                        <SelectTrigger id="to-currency">
                                            <SelectValue placeholder="Select target currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SUPPORTED_CURRENCIES.map(currency => (
                                                <SelectItem key={currency} value={currency}>
                                                    {currency} - {CURRENCY_NAMES[currency]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">Select target currency</p>
                                </div>

                                {/* Converted Amount Output */}
                                <div className="space-y-2">
                                    <Label htmlFor="converted-amount">Converted Amount</Label>
                                    <Input
                                        id="converted-amount"
                                        type="text"
                                        value={hasConverted ? convertedAmount : ''}
                                        readOnly
                                        placeholder={hasConverted ? '' : 'Click Convert to see result'}
                                        className={hasConverted
                                            ? 'border-success/50 bg-success/10'
                                            : 'bg-muted'
                                        }
                                    />
                                    {hasConverted && (
                                        <div className="flex items-center gap-2 text-sm text-success">
                                            <CheckCircle2 className="h-4 w-4" />
                                            <span className="font-medium">Conversion completed</span>
                                        </div>
                                    )}
                                </div>

                                {/* Convert Button */}
                                <Button
                                    onClick={handleConvert}
                                    className="w-full"
                                    disabled={!amount || isNaN(Number(amount))}
                                >
                                    Convert
                                </Button>
                            </>
                        )}

                        {/* Bottom Note */}
                        <div className="text-center pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                                Exchange rates provided by ExchangeRate-API.com
                            </p>
                            <p className="text-xs text-muted-foreground/70 mt-1">
                                Rates are updated in real-time and may vary
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
