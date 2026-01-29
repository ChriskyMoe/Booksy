import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusiness } from "@/lib/actions/business";
import LedgerView from "@/components/LedgerView";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { AppHeader } from "@/components/layout/AppHeader";

export default async function LedgerPage() {
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
      <AppHeader title="Ledger" subtitle="View all transactions with filters" />
      <div className="p-6">
        <LedgerView />
      </div>
    </AuthenticatedLayout>
  );
}
