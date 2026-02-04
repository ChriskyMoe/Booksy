"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Loader2, Check } from "lucide-react";
import { createPayment } from "@/lib/actions/payments";
import { getCategories } from "@/lib/actions/categories";

export default function AddPaymentForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get("type"); // 'recurring' or null

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        amount: "",
        currency: "USD",
        due_date: new Date().toISOString().split('T')[0],
        category_id: "",
        notes: "",
        is_recurring: type === "recurring"
    });

    useEffect(() => {
        async function fetchCategories() {
            const result = await getCategories('expense');
            if (result.data) {
                setCategories(result.data);
            }
        }
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await createPayment({
                ...formData,
                amount: parseFloat(formData.amount),
                transaction_date: formData.due_date, // Match schema
            });
            if (!result.error) {
                router.push("/to-pay");
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error("Failed to create payment:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto shadow-premium border-none">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    {type === "recurring" ? "Schedule Recurring Payment" : "Add New Payment"}
                </CardTitle>
                <CardDescription>
                    Enter the details of the upcoming expense to stay in control.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Payment Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Monthly Rent, AWS Invoice"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="pl-7"
                                    required
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="due_date">Due Date</Label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="due_date"
                                    type="date"
                                    className="pl-10"
                                    required
                                    value={formData.due_date}
                                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                            onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            placeholder="Add any specific details here..."
                            rows={3}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 min-w-[120px]"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Add Payment"
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
