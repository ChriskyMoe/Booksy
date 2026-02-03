"use client";

import { ToPaySummary } from "@/components/to-pay/ToPaySummary";
import { ToPayList } from "@/components/to-pay/ToPayList";
import { ToPayQuickActions } from "@/components/to-pay/ToPayQuickActions";
import { Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ToPayContent() {
    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <ToPaySummary />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* List Section */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-lg font-semibold text-foreground">Upcoming Payments</h3>
                        <p className="text-sm text-muted-foreground">Showing 5 payments</p>
                    </div>
                    <ToPayList />
                </div>

                {/* Sidebar Section */}
                <div className="lg:col-span-1">
                    <ToPayQuickActions />
                </div>
            </div>
        </div>
    );
}
