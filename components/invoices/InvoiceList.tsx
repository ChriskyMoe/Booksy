"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface InvoiceListProps {
  invoices: any[];
  loading?: boolean;
}

export default function InvoiceList({ invoices, loading }: InvoiceListProps) {
  const statusColors: Record<string, string> = {
    draft: "bg-yellow-100 text-yellow-800",
    sent: "bg-blue-100 text-blue-800",
    viewed: "bg-purple-100 text-purple-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">Loading invoices...</p>
      </Card>
    );
  }

  if (invoices.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-500 mb-4">No invoices yet</p>
        <Link href="/invoices/new">
          <Button>Create your first invoice</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Invoice
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Client
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Due Date
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <Link
                  href={`/invoices/${invoice.id}`}
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {invoice.invoice_number}
                </Link>
              </td>
              <td className="px-6 py-4 text-gray-700">{invoice.client_name}</td>
              <td className="px-6 py-4 font-semibold text-gray-900">
                ${invoice.total_amount.toFixed(2)}
              </td>
              <td className="px-6 py-4">
                <Badge className={statusColors[invoice.status]}>
                  {invoice.status.charAt(0).toUpperCase() +
                    invoice.status.slice(1)}
                </Badge>
              </td>
              <td className="px-6 py-4 text-gray-700">
                {new Date(invoice.due_date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <Link href={`/invoices/${invoice.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
