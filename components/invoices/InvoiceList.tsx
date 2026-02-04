"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Plus } from "lucide-react";
import { markInvoiceAsPaid } from "@/lib/actions/invoices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvoiceListProps {
  invoices: any[];
  loading?: boolean;
}

export default function InvoiceList({ invoices, loading }: InvoiceListProps) {
  const [showPaidModal, setShowPaidModal] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "transfer" | "other"
  >("cash");
  const [marking, setMarking] = useState(false);
  const [invoicesList, setInvoicesList] = useState(invoices);

  // Sync invoicesList with invoices prop
  useEffect(() => {
    setInvoicesList(invoices);
  }, [invoices]);

  const statusColors: Record<string, string> = {
    draft: "bg-yellow-100 text-yellow-800",
    sent: "bg-blue-100 text-blue-800",
    viewed: "bg-purple-100 text-purple-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  };

  const handlePaidClick = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setShowPaidModal(true);
  };

  const handleMarkAsPaid = async () => {
    if (!selectedInvoiceId) return;
    setMarking(true);
    try {
      await markInvoiceAsPaid(selectedInvoiceId, paymentMethod);
      // Update the invoice in the list
      setInvoicesList(
        invoicesList.map((inv) =>
          inv.id === selectedInvoiceId
            ? { ...inv, status: "paid", payment_status: "paid" }
            : inv
        )
      );
      setShowPaidModal(false);
      setSelectedInvoiceId(null);
      setPaymentMethod("cash");
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">Loading invoices...</p>
      </Card>
    );
  }

  if (invoicesList.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="space-y-6">
          <div>
            <p className="text-gray-600 text-lg font-medium mb-2">
              No invoices yet
            </p>
            <p className="text-gray-500 text-sm">
              Get started by creating your first invoice
            </p>
          </div>
          <Link href="/invoices/new">
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
              <Plus className="w-4 h-4" />
              Create Your First Invoice
            </button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Invoice
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Client/Vendor
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Status
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
            {invoicesList.map((invoice) => (
              <tr
                key={invoice.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {invoice.invoice_number}
                  </Link>
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {invoice.client_name}
                </td>
                <td className="px-6 py-4">
                  <Badge
                    className={
                      invoice.type === "expense"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-emerald-100 text-emerald-800"
                    }
                  >
                    {invoice.type === "expense" ? "Expense" : "Income"}
                  </Badge>
                </td>
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
                <td className="px-6 py-4 flex gap-2">
                  <Link href={`/invoices/${invoice.id}`}>
                    <button className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 shadow-md hover:shadow-lg">
                      View
                    </button>
                  </Link>
                  {invoice.status !== "paid" && (
                    <button
                      onClick={() => handlePaidClick(invoice.id)}
                      className="rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 shadow-md hover:shadow-lg"
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Payment Method Modal */}
      <Modal
        isOpen={showPaidModal}
        onClose={() => setShowPaidModal(false)}
        title="Mark Invoice as Paid"
        size="sm"
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">
              Select Payment Method
            </label>
            <Select
              value={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(
                  value as "cash" | "card" | "transfer" | "other"
                )
              }
            >
              <SelectTrigger className="w-full h-12 rounded-xl border-2 border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white">
                <SelectValue placeholder="Choose a payment method" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 border-gray-300 shadow-2xl z-[9999]">
                <SelectItem value="cash" className="py-3">
                  💵 Cash
                </SelectItem>
                <SelectItem value="card" className="py-3">
                  💳 Card
                </SelectItem>
                <SelectItem value="transfer" className="py-3">
                  🏦 Bank Transfer
                </SelectItem>
                <SelectItem value="other" className="py-3">
                  📄 Other
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 mt-6">
          <button
            onClick={() => setShowPaidModal(false)}
            className="px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleMarkAsPaid}
            disabled={marking}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg duration-200"
          >
            {marking ? "Processing..." : "Confirm Payment"}
          </button>
        </div>
      </Modal>
    </>
  );
}
