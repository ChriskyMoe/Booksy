import { redirect } from "next/navigation";
import { getBusiness } from "@/lib/actions/business";
import { getHealthDashboardData } from "@/lib/actions/health";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { HealthHeader } from "@/components/health/HealthHeader";
import { PrimaryHealthCard } from "@/components/health/PrimaryHealthCard";
import { ActionSummaryCards } from "@/components/health/ActionSummaryCards";
import { PlannedSpending } from "@/components/health/PlannedSpending";

export default async function BusinessHealthPage() {
  const { data: business, error: businessError } = await getBusiness();
  if (businessError || !business) {
    redirect("/setup");
  }

  const currency = business.currency || "$";

  // Fetch real health dashboard data
  const healthResult = await getHealthDashboardData();
  if (healthResult.error) {
    redirect("/setup");
  }

  const { healthData, expenses, receivables, alerts } = healthResult;

  // Placeholder for planned items - can be extended to fetch from database
  const plannedItems = [
    {
      id: "1",
      name: "New Laptop for Designer",
      estimatedCost: 2500,
      isSafe: healthData.safeCash >= 2500,
    },
    {
      id: "2",
      name: "Office Furniture Upgrade",
      estimatedCost: 8000,
      isSafe: healthData.safeCash >= 8000,
    },
    {
      id: "3",
      name: "Marketing Campaign",
      estimatedCost: 5000,
      isSafe: healthData.safeCash >= 5000,
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
          remainingBalance={healthData.remainingBalance}
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

        <PlannedSpending items={plannedItems} currency={currency} />
      </div>
    </AuthenticatedLayout>
  );
}
