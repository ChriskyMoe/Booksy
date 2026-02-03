"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InvoiceItemCard from "@/components/invoices/InvoiceItemCard";
import InvoiceItemModal from "@/components/invoices/InvoiceItemModal";
import { getInvoiceItems, deleteInvoiceItem } from "@/lib/actions/invoiceItems";
import { InvoiceItemCatalog } from "@/lib/actions/invoiceItems";

export default function InvoiceItemsContent() {
  const [items, setItems] = useState<InvoiceItemCatalog[]>([]);
  const [filteredItems, setFilteredItems] = useState<InvoiceItemCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InvoiceItemCatalog | null>(
    null
  );

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, searchQuery]);

  const loadItems = async () => {
    setLoading(true);
    const result = await getInvoiceItems();
    if (result.data) {
      setItems(result.data as InvoiceItemCatalog[]);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = items;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const handleEdit = (item: InvoiceItemCatalog) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`
    );

    if (confirmed) {
      const result = await deleteInvoiceItem(id);
      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        loadItems();
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    loadItems();
  };

  const handleNewItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Add Button */}
        <Button onClick={handleNewItem} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading items...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No items found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "Try adjusting your search"
              : "Create your first invoice item to get started"}
          </p>
          {!searchQuery && (
            <Button onClick={handleNewItem} className="gap-2">
              <Plus className="h-4 w-4" />
              Add First Item
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <InvoiceItemCard
              key={item.id}
              item={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <InvoiceItemModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        item={editingItem}
      />
    </div>
  );
}
