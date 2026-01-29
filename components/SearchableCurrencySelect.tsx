'use client'

import { useState, useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { SUPPORTED_CURRENCIES, CURRENCY_NAMES } from '@/lib/services/exchangeRate'
import { Search } from 'lucide-react'

interface SearchableCurrencySelectProps {
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    className?: string
}

export function SearchableCurrencySelect({
    value,
    onValueChange,
    placeholder = "Select currency",
    className = ""
}: SearchableCurrencySelectProps) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredCurrencies = useMemo(() => {
        if (!searchTerm) return SUPPORTED_CURRENCIES

        const term = searchTerm.toLowerCase()
        return SUPPORTED_CURRENCIES.filter(currency => {
            const code = currency.toLowerCase()
            const name = CURRENCY_NAMES[currency]?.toLowerCase() || ''
            return code.includes(term) || name.includes(term)
        })
    }, [searchTerm])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleValueChange = (newValue: string) => {
        onValueChange(newValue)
        setSearchTerm('')
    }

    return (
        <Select value={value} onValueChange={handleValueChange}>
            <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="max-h-80">
                <div className="sticky top-0 bg-background border-b border-border p-2 z-10">
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search currency..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="pl-8 h-8 text-sm"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>

                <div className="max-h-60 overflow-y-auto">
                    {filteredCurrencies.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                            No currencies found
                        </div>
                    ) : (
                        filteredCurrencies.map(currency => (
                            <SelectItem
                                key={currency}
                                value={currency}
                                className="cursor-pointer"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className="font-medium">{currency}</span>
                                    <span className="text-sm text-muted-foreground ml-2">
                                        {CURRENCY_NAMES[currency]}
                                    </span>
                                </div>
                            </SelectItem>
                        ))
                    )}
                </div>
            </SelectContent>
        </Select>
    )
}
