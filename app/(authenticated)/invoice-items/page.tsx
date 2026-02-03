import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusiness } from "@/lib/actions/business";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import InvoiceItemsContent from "@/components/invoices/InvoiceItemsContent";

export default async function InvoiceItemsPage() {
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

  return (
    <AuthenticatedLayout
      businessName={business.name}
      avatarUrl={business.avatar_url || undefined}
    >
      <AppHeader
        title="Invoice Items"
        subtitle="Manage your products and services catalog"
      />
      <div className="p-6">
        <InvoiceItemsContent />
      </div>
    </AuthenticatedLayout>
  );
}
