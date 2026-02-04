"use client";

import { useRouter } from "next/navigation";
import InvoiceForm from "@/components/invoices/InvoiceForm";

export default function NewInvoiceClient() {
  const router = useRouter();

  const handleSubmit = (invoice: any) => {
    router.push(`/invoices/${invoice.id}`);
  };

  return (
    <>
      <InvoiceForm onSubmit={handleSubmit} />
    </>
  );
}
