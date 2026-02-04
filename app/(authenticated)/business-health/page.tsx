import { redirect } from "next/navigation";
import { getBusiness } from "@/lib/actions/business";
import { getHealthDashboardData } from "@/lib/actions/health";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { HealthHeader } from "@/components/health/HealthHeader";
import { PrimaryHealthCard } from "@/components/health/PrimaryHealthCard";
import { ActionSummaryCards } from "@/components/health/ActionSummaryCards";

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
      </div>
    </AuthenticatedLayout>
  );
}
