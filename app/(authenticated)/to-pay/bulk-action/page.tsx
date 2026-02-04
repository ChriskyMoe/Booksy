import { redirect } from "next/navigation";
import { getBusiness } from "@/lib/actions/business";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import BulkActionContent from "@/components/to-pay/BulkActionContent";

export default async function BulkActionPage() {
    const { data: business, error } = await getBusiness();

    if (error || !business) {
        redirect("/setup");
    }

    const b = business as any;

    return (
        <AuthenticatedLayout businessName={b.name} avatarUrl={b.avatar_url || undefined}>
            <AppHeader
                title="Bulk Action"
                subtitle="Manage multiple upcoming payments at once"
            />

            <div className="p-6">
                <BulkActionContent />
            </div>
        </AuthenticatedLayout>
    );
}
