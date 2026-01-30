import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusiness } from "@/lib/actions/business";
import { CurrencySummaryCards } from "@/components/CurrencySummaryCards";
import { CurrencyMainConverter } from "@/components/CurrencyMainConverter";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { AppHeader } from "@/components/layout/AppHeader";

export default async function CurrencyConverterPage() {
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
        title="Currency Converter"
        subtitle="Finance-grade real-time conversion and historical trends"
      />
      <div className="p-6 max-w-5xl mx-auto space-y-8">
        <CurrencySummaryCards />
        <CurrencyMainConverter />
      </div>
    </AuthenticatedLayout>
  );
}
