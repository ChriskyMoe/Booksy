"use client";

import { useRouter } from "next/navigation";
import { generateInvoiceNumber } from "@/lib/actions/invoices";
import { useEffect, useState } from "react";
import InvoiceForm from "@/components/invoices/InvoiceForm";

export default function NewInvoiceClient() {
  const router = useRouter();
  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    const getNumber = async () => {
      try {
        const number = await generateInvoiceNumber();
        setInvoiceNumber(number);
      } catch (error) {
        console.error("Error generating invoice number:", error);
      }
    };
    getNumber();
  }, []);

  const handleSubmit = (invoice: any) => {
    router.push(`/invoices/${invoice.id}`);
  };

  if (!invoiceNumber) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <p className="text-gray-600">Invoice Number: {invoiceNumber}</p>
      <InvoiceForm onSubmit={handleSubmit} />
    </>
  );
}
