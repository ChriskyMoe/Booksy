"use client";

import { useEffect, useState } from "react";
import { getInvoices } from "@/lib/actions/invoices";
import { Input } from "@/components/ui/input";
import InvoiceList from "@/components/invoices/InvoiceList";
import { Card } from "@/components/ui/card";

export default function InvoicesClient() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | "income" | "expense">("");

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const data = await getInvoices({
          status: statusFilter || undefined,
          type: typeFilter || undefined,
          search: search || undefined,
        });
        setInvoices(data || []);
      } catch (error) {
        console.error("Error loading invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [search, statusFilter, typeFilter]);

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <Input
            placeholder="Search by invoice number or client/vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as "" | "income" | "expense")
            }
            className="px-4 py-2 border rounded-md bg-white"
          >
            <option value="">All Types</option>
            <option value="income">Income (Receivable)</option>
            <option value="expense">Expense (Payable)</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-md bg-white"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </Card>

      {/* Invoice List */}
      <InvoiceList invoices={invoices} loading={loading} />
    </div>
  );
}
