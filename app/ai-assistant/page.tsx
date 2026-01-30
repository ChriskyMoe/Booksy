import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusiness } from "@/lib/actions/business";
import AIFinancialAnalysis from "@/components/AIFinancialAnalysis";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { AppHeader } from "@/components/layout/AppHeader";

export default async function AIAssistantPage() {
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

  return (
    <AuthenticatedLayout businessName={businessName} avatarUrl={avatarUrl}>
      <AppHeader
        title="AI Financial Assistant"
        subtitle="Get insights and answers about your finances"
      />
      <div className="p-6">
        <AIFinancialAnalysis />
      </div>
    </AuthenticatedLayout>
  );
}
