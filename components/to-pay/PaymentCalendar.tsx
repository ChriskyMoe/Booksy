"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Loader2,
    ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getPayments } from "@/lib/actions/payments";
import { cn } from "@/lib/utils";

export default function PaymentCalendar() {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPayments() {
            const result = await getPayments();
            if (result.data) {
                setPayments(result.data);
            }
            setLoading(false);
        }
        fetchPayments();
    }, []);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const daysArr = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);
    const startPadding = Array.from({ length: firstDayOfMonth(year, month) }, (_, i) => null);

    const getPaymentsForDay = (day: number) => {
        const dateStr = new Date(year, month, day).toISOString().split('T')[0];
        return payments.filter(p => p.transaction_date === dateStr);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-premium overflow-hidden">
                <div className="bg-primary p-6 text-primary-foreground flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold">{monthName} {year}</h3>
                        <p className="text-primary-foreground/80 text-sm">Viewing your payment timeline</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={prevMonth} className="hover:bg-primary-foreground/10 text-primary-foreground">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={nextMonth} className="hover:bg-primary-foreground/10 text-primary-foreground">
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
                <CardContent className="p-0">
                    <div className="grid grid-cols-7 border-b bg-muted/30">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="p-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7">
                        {startPadding.concat(daysArr as any[]).map((day, ix) => (
                            <div
                                key={ix}
                                className={cn(
                                    "min-h-[120px] border-b border-r p-2 transition-colors",
                                    day === null ? "bg-muted/10" : "bg-card hover:bg-muted/5",
                                    (ix + 1) % 7 === 0 && "border-r-0"
                                )}
                            >
                                {day && (
                                    <>
                                        <span className={cn(
                                            "text-sm font-medium inline-flex items-center justify-center h-7 w-7 rounded-full",
                                            day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()
                                                ? "bg-primary text-primary-foreground"
                                                : "text-foreground"
                                        )}>
                                            {day}
                                        </span>
                                        <div className="mt-2 space-y-1">
                                            {getPaymentsForDay(day).map(p => (
                                                <div
                                                    key={p.id}
                                                    className="px-2 py-1 text-[10px] font-medium rounded bg-primary/10 text-primary truncate border border-primary/20"
                                                    title={`${p.name}: ${p.currency} ${p.amount}`}
                                                >
                                                    {p.name}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="pt-4">
                <Button variant="outline" onClick={() => router.push('/to-pay')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Overview
                </Button>
            </div>
        </div>
    );
}
