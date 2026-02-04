"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CreditCard, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { getPaymentSummary } from "@/lib/actions/payments";

interface SummaryData {
    totalAmount: number;
    paymentCount: number;
    nextPaymentDate: string | null;
    upcomingCount: number;
    baseCurrency: string;
}

interface SummaryCardProps {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ElementType;
    className?: string;
}

function SummaryCard({ title, value, subtitle, icon: Icon, className }: SummaryCardProps) {
    return (
        <div className="stat-card flex items-center gap-4 transition-premium hover:shadow-premium">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                    {subtitle && (
                        <span className="text-xs text-muted-foreground">{subtitle}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export function ToPaySummary() {
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSummary() {
            try {
                const result = await getPaymentSummary();
                if (result.data && !result.error) {
                    setSummary(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch payment summary:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchSummary();
    }, []);

    if (loading || !summary) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="stat-card flex items-center gap-4 animate-pulse">
                        <div className="h-12 w-12 rounded-xl bg-muted"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                            <div className="h-6 bg-muted rounded w-16"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const getNextPaymentInfo = () => {
        if (!summary.nextPaymentDate) return { dateText: "No upcoming", subtitle: "" };

        const nextDate = new Date(summary.nextPaymentDate);
        const today = new Date();
        const diffTime = nextDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
            dateText: nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            subtitle: diffDays > 0 ? `in ${diffDays} days` : diffDays === 0 ? "today" : "overdue"
        };
    };

    const nextPaymentInfo = getNextPaymentInfo();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SummaryCard
                title="Total To Pay"
                value={`${summary.baseCurrency} ${summary.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                subtitle={`${summary.paymentCount} payments total`}
                icon={CreditCard}
            />
            <SummaryCard
                title="Next Payment Due"
                value={nextPaymentInfo.dateText}
                subtitle={nextPaymentInfo.subtitle}
                icon={Calendar}
            />
            <SummaryCard
                title="Upcoming Payments"
                value={summary.upcomingCount.toString()}
                subtitle="scheduled in future"
                icon={Clock}
            />
        </div>
    );
}
