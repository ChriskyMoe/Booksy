import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getBusiness } from "@/lib/actions/business";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import UploadDocumentsClientV2 from "@/components/UploadDocumentsClientV2";

export default async function UploadDocumentsPage() {
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
        title="Upload Documents"
        subtitle="Upload receipts and invoices for automatic processing with OCR"
      />
      <div className="p-6">
        <UploadDocumentsClientV2 userId={user.id} />
      </div>
    </AuthenticatedLayout>
  );
}
