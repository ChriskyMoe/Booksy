'use client'

import { useState } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'

interface DataPoint {
    month: string
    income: number
    expenses: number
}

interface Summary {
    totalIncome: number
    totalExpenses: number
    netProfit: number
}

interface IncomeExpenseAnalyticsCardProps {
    data: DataPoint[]
    summary: Summary
    currency: string
}

export function IncomeExpenseAnalyticsCard({
    data,
    summary,
    currency,
}: IncomeExpenseAnalyticsCardProps) {
    const [timeFilter, setTimeFilter] = useState<'Monthly' | 'Quarterly' | 'Yearly'>('Monthly')

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            maximumFractionDigits: 0,
        }).format(value)
    }

    const stats = [
        {
            label: 'Total Income',
            value: summary.totalIncome,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            icon: ArrowUpRight,
        },
        {
            label: 'Total Expenses',
            value: summary.totalExpenses,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            icon: ArrowDownRight,
        },
        {
            label: 'Net Profit',
            value: summary.netProfit,
            color: summary.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600',
            bg: summary.netProfit >= 0 ? 'bg-emerald-50' : 'bg-rose-50',
            icon: summary.netProfit >= 0 ? TrendingUp : TrendingDown,
        },
    ]

    return (
        <Card className="border-none shadow-premium bg-card overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-xl font-bold tracking-tight">Income vs Expenses</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Monthly comparison overview</p>
                    </div>
                    <div className="flex bg-muted/50 p-1 rounded-lg gap-1 self-start">
                        {['Monthly', 'Quarterly', 'Yearly'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setTimeFilter(filter as any)}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${timeFilter === filter
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className={`p-5 rounded-2xl ${stat.bg} border border-transparent hover:border-black/5 transition-all`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-lg bg-white/80 shadow-sm ${stat.color}`}>
                                    <stat.icon className="h-4 w-4" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                                    {stat.label}
                                </span>
                            </div>
                            <div className={`text-2xl font-black ${stat.color}`}>
                                {formatCurrency(stat.value)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Visualization */}
                <div className="h-[350px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                            barGap={8}
                        >
                            <circle cx="0" cy="0" r="0" /> {/* Recharts fix for SSR */}
                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="3 3"
                                stroke="rgba(0,0,0,0.05)"
                            />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }}
                                tickFormatter={(value) => `${value / 1000}k`}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-background border shadow-premium rounded-xl p-4 space-y-2 min-w-[150px]">
                                                <p className="text-sm font-bold border-b pb-2 mb-2">
                                                    {payload[0].payload.month}
                                                </p>
                                                {payload.map((entry: any) => (
                                                    <div key={entry.name} className="flex items-center justify-between gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="h-2 w-2 rounded-full"
                                                                style={{ backgroundColor: entry.color }}
                                                            />
                                                            <span className="text-xs text-muted-foreground font-medium">
                                                                {entry.name}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs font-bold">
                                                            {formatCurrency(entry.value)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Bar
                                dataKey="income"
                                name="Income"
                                fill="hsl(var(--chart-1))"
                                radius={[6, 6, 0, 0]}
                                barSize={20}
                            />
                            <Bar
                                dataKey="expenses"
                                name="Expenses"
                                fill="hsl(var(--destructive))"
                                radius={[6, 6, 0, 0]}
                                barSize={20}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-muted/30 rounded-2xl p-6 flex items-center justify-between border border-border/50">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold">Smart Insights</h4>
                            <p className="text-xs text-muted-foreground">Your profit is {summary.netProfit >= 0 ? 'up' : 'down'} by {Math.abs(Math.round((summary.netProfit / (summary.totalExpenses || 1)) * 100))}% compared to expenses.</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl font-bold text-xs px-5">
                        View Report
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
