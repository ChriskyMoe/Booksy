"use client";

import { useState, useMemo, useEffect } from "react";
import { getTransactions } from "@/lib/actions/transactions";
import TransactionItem from "./TransactionItem";
import TransactionSearchFilter from "./TransactionSearchFilter";
import { Card, CardContent } from "@/components/ui/card";

interface TransactionListProps {
  initialTransactions?: Array<{
    id: string;
    transaction_date: string;
    category: { id: string; name: string; type: "income" | "expense" } | null;
    client_vendor: string | null;
    payment_method: string;
    base_amount: number;
    currency: string;
    status?: string;
  }>;
}

export default function TransactionList({
  initialTransactions,
}: TransactionListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState<
    "all" | "income" | "expense"
  >("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [transactions, setTransactions] = useState(initialTransactions || []);

  // Sync list when parent re-fetches (e.g. after void/delete)
  useEffect(() => {
    if (initialTransactions != null) {
      setTransactions(initialTransactions);
    }
  }, [initialTransactions]);

  // Extract unique categories and payment methods
  const categories = useMemo(() => {
    const seen = new Set<string>();
    return transactions
      .filter(
        (t) => t.category && !seen.has(t.category.id) && seen.add(t.category.id)
      )
      .map((t) => t.category!);
  }, [transactions]);

  const paymentMethods = useMemo(() => {
    return [...new Set(transactions.map((t) => t.payment_method))];
  }, [transactions]);

  // Filter transactions based on search and filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesVendor = transaction.client_vendor
          ?.toLowerCase()
          .includes(query);
        const matchesCategory = transaction.category?.name
          .toLowerCase()
          .includes(query);
        if (!matchesVendor && !matchesCategory) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory && transaction.category?.id !== selectedCategory) {
        return false;
      }

      // Type filter
      if (
        selectedType !== "all" &&
        transaction.category?.type !== selectedType
      ) {
        return false;
      }

      // Payment method filter
      if (
        selectedPaymentMethod &&
        transaction.payment_method !== selectedPaymentMethod
      ) {
        return false;
      }

      return true;
    });
  }, [
    transactions,
    searchQuery,
    selectedCategory,
    selectedType,
    selectedPaymentMethod,
  ]);

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <h3 className="text-lg font-semibold text-foreground">
            No transactions yet
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Start tracking your income and expenses by adding your first
            transaction
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <TransactionSearchFilter
        onSearchChange={setSearchQuery}
        onCategoryFilter={setSelectedCategory}
        onTypeFilter={setSelectedType}
        onPaymentMethodFilter={setSelectedPaymentMethod}
        categories={categories}
        paymentMethods={paymentMethods}
      />

      {filteredTransactions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-semibold text-foreground">
              No transactions match your filters
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Client/Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredTransactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
