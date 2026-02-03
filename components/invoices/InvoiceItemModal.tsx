"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createInvoiceItem,
  updateInvoiceItem,
  InvoiceItemCatalog,
} from "@/lib/actions/invoiceItems";
import { Loader2 } from "lucide-react";

interface InvoiceItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: InvoiceItemCatalog | null;
}

export default function InvoiceItemModal({
  isOpen,
  onClose,
  item,
}: InvoiceItemModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    unit_price: "",
    unit: "unit",
    category: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description || "",
        unit_price: item.unit_price.toString(),
        unit: item.unit,
        category: item.category || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        unit_price: "",
        unit: "unit",
        category: "",
      });
    }
  }, [item, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        name: formData.name,
        description: formData.description || undefined,
        unit_price: parseFloat(formData.unit_price),
        unit: formData.unit,
        category: formData.category || undefined,
      };

      let result;
      if (item) {
        result = await updateInvoiceItem(item.id, data);
      } else {
        result = await createInvoiceItem(data);
      }

      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Error saving item:", error);
      alert("An error occurred while saving the item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? "Edit Item" : "Create New Item"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Item Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Web Development, Consulting"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Brief description of the item or service"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="unit_price">Unit Price *</Label>
            <Input
              id="unit_price"
              type="number"
              step="0.01"
              min="0"
              value={formData.unit_price}
              onChange={(e) =>
                setFormData({ ...formData, unit_price: e.target.value })
              }
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
              placeholder="unit, hour, day"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            placeholder="e.g., Service, Product, Consultation"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {item ? "Update" : "Create"} Item
          </Button>
        </div>
      </form>
    </Modal>
  );
}
