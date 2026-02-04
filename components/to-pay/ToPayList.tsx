"use client";

import { useState } from "react";
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
    ShoppingCart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type PaymentStatus = "upcoming" | "dueSoon" | "overdue";

interface PaymentItem {
    id: string;
    name: string;
    category: string;
    dueDate: string;
    amount: number;
    status: PaymentStatus;
    icon: React.ElementType;
}

const mockPayments: PaymentItem[] = [
    {
        id: "1",
        name: "Office Rent",
        category: "Fixed Costs",
        dueDate: "2026-02-05",
        amount: 2500.00,
        status: "dueSoon",
        icon: Building2,
    },
    {
        id: "2",
        name: "Staff Salaries",
        category: "Payroll",
        dueDate: "2026-02-28",
        amount: 15000.00,
        status: "upcoming",
        icon: Users,
    },
    {
        id: "3",
        name: "IT Infrastructure",
        category: "Tech",
        dueDate: "2026-01-30",
        amount: 450.00,
        status: "overdue",
        icon: ShoppingCart,
    },
    {
        id: "4",
        name: "Cloud Hosting",
        category: "Tech",
        dueDate: "2026-02-12",
        amount: 120.00,
        status: "upcoming",
        icon: ShoppingCart,
    },
    {
        id: "5",
        name: "Inventory Restock",
        category: "Supplies",
        dueDate: "2026-02-15",
        amount: 1200.00,
        status: "upcoming",
        icon: ShoppingCart,
    },
];

const statusConfig: Record<PaymentStatus, { label: string; className: string; icon: React.ElementType }> = {
    upcoming: {
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
    const [payments] = useState<PaymentItem[]>(mockPayments);

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
                    <Button>Add Your First Payment</Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {payments.map((payment) => {
                const status = statusConfig[payment.status];
                const Icon = payment.icon;

                return (
                    <div
                        key={payment.id}
                        className={cn(
                            "group relative flex items-center justify-between p-4 rounded-xl border bg-card transition-all duration-200 hover:shadow-md hover:border-primary/20",
                            payment.status === "overdue" && "border-destructive/30 bg-destructive/5",
                            payment.status === "dueSoon" && "border-amber-200 bg-amber-50/50"
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
                                    <p className="text-xs text-muted-foreground">{payment.category}</p>
                                </div>

                                <div className="text-sm">
                                    <span className="text-muted-foreground">Due </span>
                                    <span className="font-medium">{new Date(payment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>

                                <div>
                                    <Badge variant="outline" className={cn("font-medium", status.className)}>
                                        {status.label}
                                    </Badge>
                                </div>

                                <div className="text-right pr-4">
                                    <span className="text-lg font-bold text-foreground">
                                        ${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-success hover:text-success hover:bg-success/10" title="Mark as paid">
                                <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" title="Edit">
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" title="Delete">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
