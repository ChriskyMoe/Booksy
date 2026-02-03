"use client";

import { useState, useCallback } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TransactionSearchFilterProps {
  onSearchChange: (query: string) => void;
  onCategoryFilter: (category: string) => void;
  onTypeFilter: (type: "all" | "income" | "expense") => void;
  onPaymentMethodFilter: (method: string) => void;
  categories: Array<{ id: string; name: string; type: "income" | "expense" }>;
  paymentMethods: string[];
}

export default function TransactionSearchFilter({
  onSearchChange,
  onCategoryFilter,
  onTypeFilter,
  onPaymentMethodFilter,
  categories,
  paymentMethods,
}: TransactionSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState<
    "all" | "income" | "expense"
  >("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      onSearchChange(query);
    },
    [onSearchChange]
  );

  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      setSelectedCategory(categoryId);
      onCategoryFilter(categoryId);
    },
    [onCategoryFilter]
  );

  const handleTypeChange = useCallback(
    (type: "all" | "income" | "expense") => {
      setSelectedType(type);
      onTypeFilter(type);
    },
    [onTypeFilter]
  );

  const handlePaymentMethodChange = useCallback(
    (method: string) => {
      setSelectedPaymentMethod(method);
      onPaymentMethodFilter(method);
    },
    [onPaymentMethodFilter]
  );

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedType("all");
    setSelectedPaymentMethod("");
    onSearchChange("");
    onCategoryFilter("");
    onTypeFilter("all");
    onPaymentMethodFilter("");
  }, [onSearchChange, onCategoryFilter, onTypeFilter, onPaymentMethodFilter]);

  const hasActiveFilters =
    searchQuery ||
    selectedCategory ||
    selectedType !== "all" ||
    selectedPaymentMethod;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by vendor, description..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="bg-muted/30 rounded-lg border border-border p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                Transaction Type
              </label>
              <div className="flex gap-2">
                {(["all", "income", "expense"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedType === type
                        ? type === "income"
                          ? "bg-success/20 text-success"
                          : type === "expense"
                            ? "bg-destructive/20 text-destructive"
                            : "bg-blue-500/20 text-blue-600"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method Filter */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                Payment Method
              </label>
              <select
                value={selectedPaymentMethod}
                onChange={(e) => handlePaymentMethodChange(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">All Methods</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
