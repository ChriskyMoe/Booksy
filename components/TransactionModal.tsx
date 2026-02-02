"use client";

import { useState, useEffect } from "react";
import { createSimpleTransaction, updateSimpleTransaction } from "@/lib/actions/journal";
import { getCategories } from "@/lib/actions/categories";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export interface DisplayTransactionForEdit {
  id: string;
  date: string;
  description: string;
  accountName: string;
  type: "income" | "expense";
  amount: number;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTransaction?: DisplayTransactionForEdit | null;
}

const PAYMENT_METHODS = ["cash", "card", "transfer", "other"] as const;
const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "CNY",
  "INR",
  "BRL",
];

export default function TransactionModal({
  isOpen,
  onClose,
  editTransaction = null,
}: TransactionModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; type: string }>
  >([]);
  const [formData, setFormData] = useState({
    category_id: "",
    amount: "",
    currency: "USD",
    transaction_date: new Date().toISOString().split("T")[0],
    payment_method: "cash" as const,
    client_vendor: "",
    notes: "",
  });

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && editTransaction) {
      setFormData((prev) => ({
        ...prev,
        amount: String(editTransaction.amount),
        transaction_date: editTransaction.date,
        notes: editTransaction.description || "",
        client_vendor: "",
      }));
    } else if (isOpen && !editTransaction) {
      setFormData({
        category_id: "",
        amount: "",
        currency: "USD",
        transaction_date: new Date().toISOString().split("T")[0],
        payment_method: "cash",
        client_vendor: "",
        notes: "",
      });
    }
  }, [isOpen, editTransaction]);

  const loadCategories = async () => {
    const result = await getCategories();
    if (result.data) {
      setCategories(result.data);
    }
  };

  useEffect(() => {
    if (isOpen && editTransaction && categories.length) {
      const match = categories.find((c) => c.name === editTransaction!.accountName);
      setFormData((prev) => ({
        ...prev,
        category_id: match?.id ?? prev.category_id,
      }));
    }
  }, [isOpen, editTransaction, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.category_id || !formData.amount) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const description = formData.notes || formData.client_vendor || "Transaction";

    if (editTransaction) {
      const result = await updateSimpleTransaction(editTransaction.id, {
        category_id: formData.category_id,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        transaction_date: formData.transaction_date,
        payment_method: formData.payment_method,
        description,
      });
      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        setLoading(false);
        onClose();
        router.refresh();
      }
    } else {
      const result = await createSimpleTransaction({
        category_id: formData.category_id,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        transaction_date: formData.transaction_date,
        payment_method: formData.payment_method,
        description,
      });
      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        setFormData({
          category_id: "",
          amount: "",
          currency: "USD",
          transaction_date: new Date().toISOString().split("T")[0],
          payment_method: "cash",
          client_vendor: "",
          notes: "",
        });
        setLoading(false);
        onClose();
        router.refresh();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        <div className="relative w-full max-w-md rounded-lg bg-card p-6 shadow-xl">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            {editTransaction ? "Edit Transaction" : "Add Transaction"}
          </h3>

          {error && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3">
              <p className="text-sm text-destructive-foreground">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Category *
              </label>
              <select
                required
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-ring sm:text-sm"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">
                  Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-ring sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-ring sm:text-sm"
                >
                  {CURRENCIES.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.transaction_date}
                onChange={(e) =>
                  setFormData({ ...formData, transaction_date: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-ring sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Payment Method *
              </label>
              <select
                required
                value={formData.payment_method}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payment_method: e.target
                      .value as typeof formData.payment_method,
                  })
                }
                className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-ring sm:text-sm"
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Client/Vendor
              </label>
              <input
                type="text"
                value={formData.client_vendor}
                onChange={(e) =>
                  setFormData({ ...formData, client_vendor: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-ring sm:text-sm"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-ring sm:text-sm"
                placeholder="Optional notes for transaction"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? editTransaction
                    ? "Saving..."
                    : "Adding..."
                  : editTransaction
                    ? "Save changes"
                    : "Add Transaction"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
