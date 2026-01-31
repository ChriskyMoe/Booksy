import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusiness } from "@/lib/actions/business";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InvoicesClient from "@/components/invoices/InvoicesClient";
import { Plus } from "lucide-react";

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
          <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
            <Plus className="w-4 h-4" />
            New Invoice
          </button>
        </Link>
      </AppHeader>
      <div className="p-6">
        <InvoicesClient />
      </div>
    </AuthenticatedLayout>
  );
}
