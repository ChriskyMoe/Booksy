"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CreditCard, Clock } from "lucide-react";

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
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SummaryCard
                title="Total To Pay (This Month)"
                value="$4,250.00"
                subtitle="5 payments"
                icon={CreditCard}
            />
            <SummaryCard
                title="Next Payment Date"
                value="Feb 12, 2026"
                subtitle="in 8 days"
                icon={Calendar}
            />
            <SummaryCard
                title="Upcoming Payments"
                value="12"
                subtitle="total scheduled"
                icon={Clock}
            />
        </div>
    );
}
