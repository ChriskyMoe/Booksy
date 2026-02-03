"use client";

import { Plus, CheckCircle2, XCircle } from "lucide-react";

interface PlannedItem {
    id: string;
    name: string;
    estimatedCost: number;
    isSafe: boolean;
}

interface PlannedSpendingProps {
    items: PlannedItem[];
    currency: string;
}

export function PlannedSpending({ items, currency }: PlannedSpendingProps) {
    return (
        <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                    Planned Purchases
                </h3>
                <button className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-premium text-sm font-medium">
                    <Plus className="w-4 h-4" />
                    Add Item
                </button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
                Future ideas and planned expenses
            </p>

            <div className="space-y-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-premium ${item.isSafe
                                ? "bg-muted border-border hover:bg-accent"
                                : "bg-muted border-border opacity-60 hover:opacity-80"
                            }`}
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <div
                                className={`flex-shrink-0 w-2 h-2 rounded-full ${item.isSafe ? "bg-success" : "bg-muted-foreground"
                                    }`}
                            />
                            <div className="flex-1">
                                <p className={`font-medium ${item.isSafe ? "text-foreground" : "text-muted-foreground"}`}>
                                    {item.name}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Estimated: {currency}
                                    {item.estimatedCost.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {item.isSafe ? (
                                <span className="flex items-center gap-1 px-3 py-1 bg-success bg-opacity-10 text-success rounded-full text-xs font-semibold">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Safe
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-semibold">
                                    <XCircle className="w-3 h-3" />
                                    Not Safe
                                </span>
                            )}
                        </div>
                    </div>
                ))}

                {items.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <p className="text-sm">No planned purchases yet</p>
                        <p className="text-xs mt-1">Add items you're considering for the future</p>
                    </div>
                )}
            </div>
        </div>
    );
}
