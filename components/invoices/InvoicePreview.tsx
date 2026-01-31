"use client";

import { Invoice } from "@/types/invoice";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface InvoicePreviewProps {
  invoice: Invoice;
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const statusColors: Record<string, string> = {
    draft: "bg-yellow-100 text-yellow-800",
    sent: "bg-blue-100 text-blue-800",
    viewed: "bg-purple-100 text-purple-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  };

  return (
    <Card className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-8 border-b">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{invoice.title}</h1>
          <p className="text-gray-600 text-sm mt-1">
            Invoice #{invoice.invoice_number}
          </p>
        </div>
        <Badge className={statusColors[invoice.status]}>
          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </Badge>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Invoice Details
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice Number:</span>
              <span className="font-medium text-gray-900">
                {invoice.invoice_number}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Issue Date:</span>
              <span className="font-medium text-gray-900">
                {new Date(invoice.issue_date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Due Date:</span>
              <span className="font-medium">
                {new Date(invoice.due_date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Currency:</span>
              <span className="font-medium">{invoice.currency}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-4">
            Client Information
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <p className="font-medium">{invoice.client_name}</p>
              {invoice.client_email && (
                <p className="text-gray-600">{invoice.client_email}</p>
              )}
              {invoice.client_address && (
                <p className="text-gray-600">{invoice.client_address}</p>
              )}
              {invoice.client_phone && (
                <p className="text-gray-600">{invoice.client_phone}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2">
              <th className="text-left py-3 font-semibold">Description</th>
              <th className="text-right py-3 font-semibold">Qty</th>
              <th className="text-right py-3 font-semibold">Unit Price</th>
              <th className="text-right py-3 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-3">{item.description}</td>
                <td className="text-right py-3">{item.quantity}</td>
                <td className="text-right py-3">
                  ${item.unit_price.toFixed(2)}
                </td>
                <td className="text-right py-3">${item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2 text-sm">
            <span>Subtotal:</span>
            <span>${invoice.subtotal.toFixed(2)}</span>
          </div>
          {invoice.tax_rate > 0 && (
            <>
              <div className="flex justify-between py-2 text-sm">
                <span>Tax ({invoice.tax_rate}%):</span>
                <span>${invoice.tax_amount.toFixed(2)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between py-3 text-lg font-bold border-t border-b">
            <span>Total:</span>
            <span>${invoice.total_amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-8 p-4 bg-gray-50 rounded">
          <h3 className="text-sm font-semibold mb-2">Notes</h3>
          <p className="text-sm text-gray-700">{invoice.notes}</p>
        </div>
      )}

      {/* Terms */}
      {invoice.terms && (
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="text-sm font-semibold mb-2">Terms & Conditions</h3>
          <p className="text-sm text-gray-700">{invoice.terms}</p>
        </div>
      )}
    </Card>
  );
}
