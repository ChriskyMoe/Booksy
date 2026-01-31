import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusiness } from "@/lib/actions/business";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import InvoiceDetailClient from "@/components/invoices/InvoiceDetailClient";

export default async function InvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
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
        title="Invoice Details"
        subtitle="View and manage your invoice"
      />
      <div className="p-6">
        <InvoiceDetailClient invoiceId={params.id} />
      </div>
    </AuthenticatedLayout>
  );
}
