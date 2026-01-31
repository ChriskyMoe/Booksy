"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getInvoice,
  updateInvoiceStatus,
  deleteInvoice,
} from "@/lib/actions/invoices";
import { Invoice } from "@/types/invoice";
import { Button } from "@/components/ui/button";
import InvoicePreview from "@/components/invoices/InvoicePreview";
import PaymentForm from "@/components/invoices/PaymentForm";

export default function InvoiceDetailClient({
  invoiceId,
}: {
  invoiceId: string;
}) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const data = await getInvoice(invoiceId);
        setInvoice(data);
      } catch (error) {
        console.error("Error loading invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [invoiceId]);

  const handleStatusChange = async (status: string) => {
    try {
      await updateInvoiceStatus(invoiceId, status);
      setInvoice(invoice ? { ...invoice, status: status as any } : null);
    } catch (error) {
      console.error("Error updating invoice status:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this invoice?"))
      return;
    try {
      await deleteInvoice(invoiceId);
      router.push("/invoices");
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const handlePaymentRecorded = async () => {
    try {
      const data = await getInvoice(invoiceId);
      setInvoice(data);
    } catch (error) {
      console.error("Error refreshing invoice:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Loading invoice...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Invoice not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold">{invoice.title}</h1>
          <p className="text-gray-600 text-sm mt-1">
            Invoice #{invoice.invoice_number}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/invoices/${invoiceId}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <select
            value={invoice.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-4 py-2 border rounded-md bg-white text-sm font-medium"
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="viewed">Viewed</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <InvoicePreview invoice={invoice} />
        </div>
        <div className="space-y-6">
          <PaymentForm
            invoice={invoice}
            onPaymentRecorded={handlePaymentRecorded}
          />

          {invoice.payments && invoice.payments.length > 0 && (
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-semibold mb-4 text-gray-900">
                Payment History
              </h3>
              <div className="space-y-3">
                {invoice.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex justify-between items-center text-sm pb-3 border-b last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        ${payment.amount.toFixed(2)}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </p>
                    </div>
                    {payment.payment_method && (
                      <span className="text-gray-600 text-xs">
                        {payment.payment_method}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
