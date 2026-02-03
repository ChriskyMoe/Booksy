"use client";

import { ArrowUpRight, Calendar, AlertCircle } from "lucide-react";

interface ExpenseItem {
    name: string;
    dueDate: string;
    amount: number;
}

interface ReceivableItem {
    name: string;
    dueDate: string;
    amount: number;
    isOverdue: boolean;
}

interface ActionSummaryCardsProps {
    expenses: ExpenseItem[];
    receivables: ReceivableItem[];
    currency: string;
}

export function ActionSummaryCards({
    expenses,
    receivables,
    currency,
}: ActionSummaryCardsProps) {
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const totalReceivables = receivables.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* To Pay Card */}
            <div className="bg-card rounded-xl shadow-card border border-border p-6 hover:shadow-elevated transition-premium">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">To Pay</h3>
                    <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 transition-premium">
                        View all
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-3xl font-bold text-foreground">
                        {currency}
                        {totalExpenses.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Due this month
                    </p>
                </div>

                <div className="space-y-3">
                    {expenses.slice(0, 3).map((expense, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-accent transition-premium cursor-pointer"
                        >
                            <div className="flex-1">
                                <p className="font-medium text-foreground">{expense.name}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground">{expense.dueDate}</p>
                                </div>
                            </div>
                            <p className="font-semibold text-foreground">
                                {currency}
                                {expense.amount.toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* To Receive Card */}
            <div className="bg-card rounded-xl shadow-card border border-border p-6 hover:shadow-elevated transition-premium">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">To Receive</h3>
                    <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 transition-premium">
                        View all
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-3xl font-bold text-foreground">
                        {currency}
                        {totalReceivables.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Expected this month
                    </p>
                </div>

                <div className="space-y-3">
                    {receivables.slice(0, 3).map((receivable, index) => (
                        <div
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-premium cursor-pointer ${receivable.isOverdue ? "bg-destructive bg-opacity-5" : "bg-muted"
                                }`}
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-foreground">{receivable.name}</p>
                                    {receivable.isOverdue && (
                                        <AlertCircle className="w-4 h-4 text-destructive" />
                                    )}
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                    <p className={`text-xs ${receivable.isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
                                        {receivable.isOverdue ? "Overdue" : receivable.dueDate}
                                    </p>
                                </div>
                            </div>
                            <p className="font-semibold text-foreground">
                                {currency}
                                {receivable.amount.toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
