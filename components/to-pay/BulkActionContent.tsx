"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    CheckCircle2,
    Trash2,
    AlertCircle,
    Calendar,
    ArrowLeft,
    Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getPayments, markPaymentAsPaid, deletePayment } from "@/lib/actions/payments";
import { cn } from "@/lib/utils";

export default function BulkActionContent() {
    const router = useRouter();
    const [payments, setPayments] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        async function fetchPayments() {
            const result = await getPayments({ status: 'pending' });
            if (result.data) {
                setPayments(result.data);
            }
            setLoading(false);
        }
        fetchPayments();
    }, []);

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === payments.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(payments.map(p => p.id));
        }
    };

    const handleBulkMarkPaid = async () => {
        setActionLoading(true);
        try {
            await Promise.all(selectedIds.map(id => markPaymentAsPaid(id)));
            setPayments(prev => prev.filter(p => !selectedIds.includes(p.id)));
            setSelectedIds([]);
        } catch (error) {
            console.error("Bulk mark as paid failed:", error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} payments?`)) return;
        setActionLoading(true);
        try {
            await Promise.all(selectedIds.map(id => deletePayment(id)));
            setPayments(prev => prev.filter(p => !selectedIds.includes(p.id)));
            setSelectedIds([]);
        } catch (error) {
            console.error("Bulk delete failed:", error);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-primary/10 shadow-sm">
                <div className="flex items-center gap-4">
                    <Checkbox
                        checked={selectedIds.length === payments.length && payments.length > 0}
                        onChange={toggleSelectAll}
                    />
                    <span className="text-sm font-medium">
                        {selectedIds.length} selected
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-success hover:bg-success/10 hover:text-success"
                        disabled={selectedIds.length === 0 || actionLoading}
                        onClick={handleBulkMarkPaid}
                    >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark Paid
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        disabled={selectedIds.length === 0 || actionLoading}
                        onClick={handleBulkDelete}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="space-y-3">
                {payments.length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed text-muted-foreground">
                        No pending payments to manage.
                    </div>
                ) : (
                    payments.map((payment) => (
                        <div
                            key={payment.id}
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-xl border bg-card transition-all hover:bg-muted/50 cursor-pointer",
                                selectedIds.includes(payment.id) && "border-primary bg-primary/5 shadow-sm"
                            )}
                            onClick={() => toggleSelect(payment.id)}
                        >
                            <Checkbox
                                checked={selectedIds.includes(payment.id)}
                                onCheckedChange={() => toggleSelect(payment.id)}
                            />
                            <div className="flex items-center gap-3 flex-1">
                                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold">{payment.name}</h4>
                                    <p className="text-xs text-muted-foreground">Due: {new Date(payment.transaction_date).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">{payment.currency} {payment.amount.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">{payment.category?.name || 'Uncategorized'}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="pt-4">
                <Button variant="outline" onClick={() => router.push('/to-pay')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Overview
                </Button>
            </div>
        </div>
    );
}
