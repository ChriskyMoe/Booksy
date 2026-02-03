import { redirect } from "next/navigation";
import { getBusiness } from "@/lib/actions/business";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import ToPayContent from "@/components/to-pay/ToPayContent";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default async function ToPayPage() {
    const { data: business, error } = await getBusiness();

    if (error || !business) {
        redirect("/setup");
    }

    // Cast to handle potential inference issues in some environments
    const b = business as any;

    return (
        <AuthenticatedLayout businessName={b.name} avatarUrl={b.avatar_url || undefined}>
            <AppHeader
                title="To Pay"
                subtitle="Upcoming payments you need to make"
            >
                <div className="flex items-center gap-3">
                    <Select defaultValue="this-month">
                        <SelectTrigger className="w-[160px] bg-background border-none shadow-sm h-10">
                            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="Date Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="this-month">This Month</SelectItem>
                            <SelectItem value="next-30">Next 30 Days</SelectItem>
                            <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="h-10 px-6 shadow-md hover:shadow-lg transition-all duration-200">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Payment
                    </Button>
                </div>
            </AppHeader>

            <div className="p-6">
                <ToPayContent />
            </div>
        </AuthenticatedLayout>
    );
}
