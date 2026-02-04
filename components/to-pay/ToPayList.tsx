"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    MoreHorizontal,
    CheckCircle2,
    Edit2,
    Trash2,
    AlertCircle,
    Calendar,
    Clock,
    Building2,
    Users,
    ShoppingCart,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getPayments, markPaymentAsPaid, deletePayment, Payment } from "@/lib/actions/payments";

type PaymentStatus = "pending" | "dueSoon" | "overdue";

const categoryIcons: Record<string, React.ElementType> = {
    "Rent": Building2,
    "Utilities": Building2,
    "Marketing": ShoppingCart,
    "Payroll": Users,
    "default": Calendar,
};

const statusConfig: Record<PaymentStatus, { label: string; className: string; icon: React.ElementType }> = {
    pending: {
        label: "Upcoming",
        className: "bg-primary/10 text-primary border-primary/20",
        icon: Calendar,
    },
    dueSoon: {
        label: "Due Soon",
        className: "bg-warning/10 text-warning border-warning/20",
        icon: Clock,
    },
    overdue: {
        label: "Overdue",
        className: "bg-destructive/10 text-destructive border-destructive/20",
        icon: AlertCircle,
    },
};

export function ToPayList() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPayments() {
            try {
                const result = await getPayments({ status: 'pending' });
                if (result.data && !result.error) {
                    const processedPayments = result.data.map(payment => {
                        const today = new Date();
                        const dueDate = new Date(payment.transaction_date);
                        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                        let status: PaymentStatus = 'pending';
                        if (daysUntilDue < 0) {
                            status = 'overdue';
                        } else if (daysUntilDue <= 7) {
                            status = 'dueSoon';
                        }

                        return { ...payment, status };
                    });
                    setPayments(processedPayments);
                } else if (result.error) {
                    setError(result.error);
                }
            } catch (err) {
                setError('Failed to fetch payments');
            } finally {
                setLoading(false);
            }
        }
        fetchPayments();
    }, []);

    const handleMarkAsPaid = async (id: string) => {
        const result = await markPaymentAsPaid(id);
        if (result.data) {
            setPayments(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const result = await deletePayment(id);
        if (!result.error) {
            setPayments(prev => prev.filter(p => p.id !== id));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (payments.length === 0) {
        return (
            <Card className="border-dashed border-2 py-12">
                <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">No upcoming payments yet</h3>
                        <p className="text-muted-foreground max-w-sm">
                            Keep your business running smoothly by tracking your upcoming expenses here.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {payments.map((payment) => {
                const status = statusConfig[payment.status as PaymentStatus] || statusConfig.pending;
                const Icon = categoryIcons[payment.category?.name] || categoryIcons.default;

                return (
                    <div
                        key={payment.id}
                        className={cn(
                            "group relative flex items-center justify-between p-4 rounded-xl border bg-card transition-all duration-200 hover:shadow-md hover:border-primary/20",
                            payment.status === "overdue" && "border-destructive/30 bg-destructive/5",
                            payment.status === "dueSoon" && "border-warning/20 bg-warning/5"
                        )}
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <div className={cn(
                                "h-10 w-10 rounded-lg flex items-center justify-center",
                                "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                            )}>
                                <Icon className="h-5 w-5" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 items-center">
                                <div className="md:col-span-1">
                                    <h4 className="font-semibold text-foreground">{payment.name}</h4>
                                    <p className="text-xs text-muted-foreground">{payment.category?.name || 'Uncategorized'}</p>
                                </div>

                                <div className="text-sm">
                                    <span className="text-muted-foreground">Due </span>
                                    <span className="font-medium">{new Date(payment.transaction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>

                                <div>
                                    <Badge variant="outline" className={cn("font-medium", status.className)}>
                                        {status.label}
                                    </Badge>
                                </div>

                                <div className="text-right pr-4">
                                    <span className="text-lg font-bold text-foreground">
                                        {payment.currency} {payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                                title="Mark as paid"
                                onClick={() => handleMarkAsPaid(payment.id)}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                title="Delete"
                                onClick={() => handleDelete(payment.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
