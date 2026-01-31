"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getInvoice } from "@/lib/actions/invoices";
import { Invoice } from "@/types/invoice";
import InvoiceForm from "@/components/invoices/InvoiceForm";

export default function EditInvoiceClient({
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

  const handleSubmit = () => {
    router.push(`/invoices/${invoiceId}`);
  };

  if (loading) return <div>Loading invoice...</div>;
  if (!invoice) return <div>Invoice not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Invoice</h1>
        <p className="text-gray-600 mt-2">
          Invoice Number: {invoice.invoice_number}
        </p>
      </div>
      <InvoiceForm invoice={invoice} onSubmit={handleSubmit} />
    </div>
  );
}
