import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusiness } from "@/lib/actions/business";
import TransactionList from "@/components/TransactionList";
import AddTransactionButton from "@/components/AddTransactionButton";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import Link from "next/link";
import { Tag } from "lucide-react";

export default async function TransactionsPage() {
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
        title="Transactions"
        subtitle="Manage your income and expenses"
      >
        <div className="flex gap-2">
          <Link href="/categories">
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
              <Tag className="w-4 h-4" />
              Categories
            </button>
          </Link>
          <AddTransactionButton />
        </div>
      </AppHeader>
      <div className="p-6">
        <TransactionList />
      </div>
    </AuthenticatedLayout>
  );
}
