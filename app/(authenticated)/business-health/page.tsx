import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusiness } from "@/lib/actions/business";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { HealthHeader } from "@/components/health/HealthHeader";
import { PrimaryHealthCard } from "@/components/health/PrimaryHealthCard";
import { ActionSummaryCards } from "@/components/health/ActionSummaryCards";
import { HealthAlerts } from "@/components/health/HealthAlerts";
import { PlannedSpending } from "@/components/health/PlannedSpending";

export default async function BusinessHealthPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: business, error: businessError } = await getBusiness();
    if (businessError || !business) {
        redirect("/setup");
    }

    // Mock data - replace with actual data fetching
    const currency = business.currency || "$";

    const healthData = {
        currentCash: 45000,
        safeCash: 32000,
        status: "warning" as const,
        explanation:
            "You may run short before the end of the month if expenses continue as planned. Consider delaying non-essential purchases.",
    };

    const expenses = [
        { name: "Office Rent", dueDate: "Feb 5, 2026", amount: 3500 },
        { name: "Employee Salaries", dueDate: "Feb 10, 2026", amount: 12000 },
        { name: "Supplier Payment", dueDate: "Feb 15, 2026", amount: 4200 },
    ];

    const receivables = [
        { name: "Client A", dueDate: "Feb 3, 2026", amount: 8500, isOverdue: false },
        { name: "Client B", dueDate: "Overdue", amount: 3200, isOverdue: true },
        { name: "Client C", dueDate: "Feb 12, 2026", amount: 5800, isOverdue: false },
    ];

    const alerts = [
        {
            id: "1",
            type: "urgent" as const,
            message: "Office rent due in 2 days",
            icon: "clock" as const,
        },
        {
            id: "2",
            type: "warning" as const,
            message: "Client B payment is overdue",
            icon: "alert" as const,
        },
        {
            id: "3",
            type: "info" as const,
            message: "Cash flow trending lower than last month",
            icon: "trend" as const,
        },
    ];

    const plannedItems = [
        {
            id: "1",
            name: "New Laptop for Designer",
            estimatedCost: 2500,
            isSafe: true,
        },
        {
            id: "2",
            name: "Office Furniture Upgrade",
            estimatedCost: 8000,
            isSafe: false,
        },
        {
            id: "3",
            name: "Marketing Campaign",
            estimatedCost: 5000,
            isSafe: false,
        },
    ];

    return (
        <AuthenticatedLayout
            businessName={business.name}
            avatarUrl={business.avatar_url || undefined}
        >
            <div className="p-6 space-y-6">
                <HealthHeader />

                <PrimaryHealthCard
                    currentCash={healthData.currentCash}
                    safeCash={healthData.safeCash}
                    status={healthData.status}
                    explanation={healthData.explanation}
                    currency={currency}
                />

                <ActionSummaryCards
                    expenses={expenses}
                    receivables={receivables}
                    currency={currency}
                />

                <HealthAlerts alerts={alerts} />

                <PlannedSpending items={plannedItems} currency={currency} />
            </div>
        </AuthenticatedLayout>
    );
}
