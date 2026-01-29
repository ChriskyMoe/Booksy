'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

const POPULAR_PAIRS = [
    { pair: 'THB / EUR', name: 'Euro', change: 0.24, rate: '0.027', positive: true },
    { pair: 'USD / THB', name: 'Thai Baht', change: -0.12, rate: '36.45', positive: false },
    { pair: 'GBP / THB', name: 'Thai Baht', change: 0.15, rate: '45.12', positive: true },
    { pair: 'EUR / USD', name: 'US Dollar', change: 0.08, rate: '1.08', positive: true },
    { pair: 'JPY / USD', name: 'US Dollar', change: -0.05, rate: '0.0067', positive: false },
    { pair: 'AUD / USD', name: 'US Dollar', change: 0.18, rate: '0.65', positive: true },
    { pair: 'CAD / USD', name: 'US Dollar', change: -0.09, rate: '0.73', positive: false },
    { pair: 'CHF / USD', name: 'US Dollar', change: 0.11, rate: '1.12', positive: true },
    { pair: 'CNY / USD', name: 'US Dollar', change: -0.03, rate: '0.14', positive: false },
    { pair: 'INR / USD', name: 'US Dollar', change: 0.22, rate: '0.012', positive: true },
    { pair: 'SGD / USD', name: 'US Dollar', change: -0.07, rate: '0.74', positive: false },
    { pair: 'HKD / USD', name: 'US Dollar', change: 0.01, rate: '0.13', positive: true },
    { pair: 'NZD / USD', name: 'US Dollar', change: 0.19, rate: '0.61', positive: true },
    { pair: 'SEK / USD', name: 'US Dollar', change: -0.14, rate: '0.094', positive: false },
    { pair: 'NOK / USD', name: 'US Dollar', change: 0.13, rate: '0.095', positive: true },
]

export function CurrencySummaryCards() {
    return (
        <div className="relative">
            {/* Gradient fade effect on the left */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>

            {/* Gradient fade effect on the right */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
                {POPULAR_PAIRS.map((data, index) => (
                    <Card
                        key={index}
                        className="min-w-[180px] bg-card/50 backdrop-blur-sm border-border/50 shadow-sm shrink-0 hover:bg-card/70 hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-semibold text-muted-foreground">{data.pair}</span>
                                <div className={`flex items-center text-[10px] font-bold ${data.positive ? 'text-success' : 'text-destructive'}`}>
                                    {data.positive ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                                    {Math.abs(data.change)}%
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
