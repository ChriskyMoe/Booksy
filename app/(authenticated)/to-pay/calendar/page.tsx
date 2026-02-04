import { redirect } from "next/navigation";
import { getBusiness } from "@/lib/actions/business";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import PaymentCalendar from "@/components/to-pay/PaymentCalendar";

export default async function CalendarPage() {
    const { data: business, error } = await getBusiness();

    if (error || !business) {
        redirect("/setup");
    }

    const b = business as any;

    return (
        <AuthenticatedLayout businessName={b.name} avatarUrl={b.avatar_url || undefined}>
            <AppHeader
                title="Payment Calendar"
                subtitle="Visualize your upcoming expenses over time"
            />

            <div className="p-6">
                <PaymentCalendar />
            </div>
        </AuthenticatedLayout>
    );
}
