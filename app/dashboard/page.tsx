import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getDashboardData,
  getExpenseBreakdownChartData,
} from "@/lib/actions/dashboard";
import { getBusiness } from "@/lib/actions/business";
import DashboardStats from "@/components/DashboardStats";
import ExpenseBreakdown from "@/components/ExpenseBreakdown";
import RecentTransactions from "@/components/RecentTransactions";
import DashboardCharts from "@/components/DashboardCharts";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import ExpensePieChart from "@/components/ExpensePieChart";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const businessResult = await getBusiness();
  if (businessResult.error || !businessResult.data) {
    redirect("/setup");
  }
  const business = businessResult.data;
  const businessName = business?.name;
  const avatarUrl = business?.avatar_url;

  const dashboardResult = await getDashboardData();
  const dashboardData = dashboardResult.data;

  const expenseBreakdownChartDataResult = await getExpenseBreakdownChartData();
  const expenseBreakdownChartData = expenseBreakdownChartDataResult.data || [];

  if (!dashboardData) {
    return (
      <AuthenticatedLayout businessName={businessName} avatarUrl={avatarUrl}>
        <div className="p-6">Error loading dashboard</div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout businessName={businessName} avatarUrl={avatarUrl}>
      <AppHeader
        title="Dashboard"
        subtitle="Overview of your business finances"
      />
      <div className="p-6 space-y-8">
        <DashboardStats data={dashboardData} />

        <DashboardCharts
          income={dashboardData.income}
          expenses={dashboardData.expenses}
          profit={dashboardData.profit}
          currency={dashboardData.currency}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <ExpensePieChart
              data={expenseBreakdownChartData}
              currency={dashboardData.currency}
            />
            <ExpenseBreakdown data={dashboardData.expenseBreakdown} />
          </div>
          <RecentTransactions />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
