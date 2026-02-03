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
        <div className="flex gap-3 items-center">
          <select
            value={invoice.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-sm font-medium hover:border-gray-400 transition-colors"
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="viewed">Viewed</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Link href={`/invoices/${invoiceId}/edit`}>
            <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Edit
            </Button>
          </Link>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <InvoicePreview invoice={invoice} />
        </div>
      </div>
      <div className="flex justify-center pt-8">
        <Button
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-12 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg w-full max-w-xs"
          onClick={() => router.push("/invoices")}
        >
          Done
        </Button>
      </div>
    </div>
  );
}
