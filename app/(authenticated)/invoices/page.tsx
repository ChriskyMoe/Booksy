import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusiness } from "@/lib/actions/business";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InvoicesClient from "@/components/invoices/InvoicesClient";

export default async function InvoicesPage() {
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
      <AppHeader title="Invoices" subtitle="Create and manage your invoices">
        <Link href="/invoices/new">
          <Button>+ New Invoice</Button>
        </Link>
      </AppHeader>
      <div className="p-6">
        <InvoicesClient />
      </div>
    </AuthenticatedLayout>
  );
}
