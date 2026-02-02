import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusiness } from "@/lib/actions/business";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import NewInvoiceClient from "@/components/invoices/NewInvoiceClient";

export default async function NewInvoicePage() {
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
  const businessName = business.name;
  const avatarUrl = business.avatar_url;

  return (
    <AuthenticatedLayout businessName={businessName} avatarUrl={avatarUrl}>
      <AppHeader
        title="Create Invoice"
        subtitle="Generate a new invoice for your client"
      />
      <div className="p-6">
        <NewInvoiceClient />
      </div>
    </AuthenticatedLayout>
  );
}
