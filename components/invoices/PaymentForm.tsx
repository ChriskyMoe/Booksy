"use client";

import { useState } from "react";
import { Invoice } from "@/types/invoice";
import { recordPayment } from "@/lib/actions/invoices";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PaymentFormProps {
  invoice: Invoice;
  onPaymentRecorded?: () => void;
}

export default function PaymentForm({
  invoice,
  onPaymentRecorded,
}: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(
    (
      invoice.total_amount -
      (invoice.payments || []).reduce((sum, p) => sum + p.amount, 0)
    ).toString()
  );
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const totalPaid = (invoice.payments || []).reduce(
    (sum, p) => sum + p.amount,
    0
  );
  const remaining = invoice.total_amount - totalPaid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await recordPayment(invoice.id, parseFloat(amount), paymentDate);
      onPaymentRecorded?.();
    } catch (error) {
      console.error("Error recording payment:", error);
    } finally {
      setLoading(false);
    }
  };

  if (invoice.payment_status === "paid") {
    return (
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
        <p className="text-green-800 font-semibold">
          This invoice has been fully paid
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-50 p-4 rounded-lg"
    >
      <h3 className="font-semibold">Record Payment</h3>

      <div className="grid grid-cols-3 gap-4 text-sm mb-4">
        <div>
          <p className="text-gray-600">Total Amount</p>
          <p className="font-bold">${invoice.total_amount.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600">Already Paid</p>
          <p className="font-bold">${totalPaid.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600">Remaining</p>
          <p className="font-bold text-red-600">${remaining.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Payment Amount *</Label>
          <Input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            max={remaining}
            required
          />
        </div>
        <div>
          <Label>Payment Date *</Label>
          <Input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Recording..." : "Record Payment"}
      </Button>
    </form>
  );
}
