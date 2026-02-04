import { redirect } from "next/navigation";
import { getBusiness } from "@/lib/actions/business";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import AddPaymentForm from "@/components/to-pay/AddPaymentForm";

export default async function AddPaymentPage() {
    const { data: business, error } = await getBusiness();

    if (error || !business) {
        redirect("/setup");
    }

    const b = business as any;

    return (
        <AuthenticatedLayout businessName={b.name} avatarUrl={b.avatar_url || undefined}>
            <AppHeader
                title="Add Payment"
                subtitle="Specify an upcoming expense to track"
            />

            <div className="p-6">
                <AddPaymentForm />
            </div>
        </AuthenticatedLayout>
    );
}
