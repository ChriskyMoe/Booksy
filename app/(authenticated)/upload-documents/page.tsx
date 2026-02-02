import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UploadDocumentsClient from "@/components/UploadDocumentsClient";

export default async function UploadDocumentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload Documents</h1>
        <p className="text-muted-foreground">
          Upload receipts and invoices for automatic processing with OCR
        </p>
      </div>
      <UploadDocumentsClient userId={user.id} />
    </div>
  );
}
