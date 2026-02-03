"use client";

import { useState } from "react";

type DateRange = "this-month" | "next-30-days";

export function HealthHeader() {
    const [dateRange, setDateRange] = useState<DateRange>("this-month");

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    Business Health Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                    Your real cash position for this month
                </p>
            </div>

            <div className="flex gap-2 bg-muted rounded-lg p-1">
                <button
                    onClick={() => setDateRange("this-month")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-premium ${dateRange === "this-month"
                            ? "bg-card shadow-card text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    This Month
                </button>
                <button
                    onClick={() => setDateRange("next-30-days")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-premium ${dateRange === "next-30-days"
                            ? "bg-card shadow-card text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Next 30 Days
                </button>
            </div>
        </div>
    );
}
