"use client";

import { useState } from "react";
import { Invoice, InvoiceItem } from "@/types/invoice";
import { createInvoice, updateInvoice } from "@/lib/actions/invoices";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface InvoiceFormProps {
  invoice?: Invoice;
  onSubmit?: (invoice: Invoice) => void;
}

export default function InvoiceForm({ invoice, onSubmit }: InvoiceFormProps) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>(invoice?.items || []);
  const [formData, setFormData] = useState({
    invoice_number: invoice?.invoice_number || "",
    title: invoice?.title || "Invoice",
    client_name: invoice?.client_name || "",
    client_email: invoice?.client_email || "",
    client_address: invoice?.client_address || "",
    issue_date: invoice?.issue_date || new Date().toISOString().split("T")[0],
    due_date: invoice?.due_date || "",
    currency: invoice?.currency || "USD",
    tax_rate: invoice?.tax_rate || 0,
    notes: invoice?.notes || "",
    terms: invoice?.terms || "",
  });

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * formData.tax_rate) / 100;
  const total = subtotal + taxAmount;

  const handleAddItem = () => {
    setItems([
      ...items,
      { description: "", quantity: 1, unit_price: 0, amount: 0 },
    ]);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === "quantity" || field === "unit_price") {
      newItems[index].amount =
        newItems[index].quantity * newItems[index].unit_price;
    }

    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        subtotal,
        tax_amount: taxAmount,
        total_amount: total,
        items,
        description: "",
      };

      if (invoice) {
        await updateInvoice(invoice.id, data as any);
      } else {
        const created = await createInvoice(data as any);
        onSubmit?.(created);
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Client Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Client Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Client Name *</Label>
            <Input
              value={formData.client_name}
              onChange={(e) =>
                setFormData({ ...formData, client_name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.client_email}
              onChange={(e) =>
                setFormData({ ...formData, client_email: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <Label>Address</Label>
            <Textarea
              value={formData.client_address}
              onChange={(e) =>
                setFormData({ ...formData, client_address: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Invoice Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Invoice Number *</Label>
            <Input
              value={formData.invoice_number}
              onChange={(e) =>
                setFormData({ ...formData, invoice_number: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label>Issue Date *</Label>
            <Input
              type="date"
              value={formData.issue_date}
              onChange={(e) =>
                setFormData({ ...formData, issue_date: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label>Due Date *</Label>
            <Input
              type="date"
              value={formData.due_date}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
              required
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Line Items</h3>
          <Button type="button" onClick={handleAddItem} variant="outline">
            + Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 items-end">
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  handleItemChange(index, "description", e.target.value)
                }
              />
              <Input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "quantity",
                    parseFloat(e.target.value)
                  )
                }
              />
              <Input
                type="number"
                placeholder="Price"
                value={item.unit_price}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "unit_price",
                    parseFloat(e.target.value)
                  )
                }
              />
              <div className="flex gap-2">
                <Input
                  disabled
                  value={item.amount.toFixed(2)}
                  className="bg-gray-100"
                />
                <Button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  variant="destructive"
                  size="sm"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Tax Rate:</span>
          <div className="flex items-center">
            <Input
              type="number"
              value={formData.tax_rate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tax_rate: parseFloat(e.target.value),
                })
              }
              className="w-20"
            />
            <span className="ml-2">%</span>
          </div>
        </div>
        <div className="flex justify-between">
          <span>Tax Amount:</span>
          <span>${taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t pt-2">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-4">
        <div>
          <Label>Notes</Label>
          <Textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Additional notes..."
          />
        </div>
        <div>
          <Label>Terms & Conditions</Label>
          <Textarea
            value={formData.terms}
            onChange={(e) =>
              setFormData({ ...formData, terms: e.target.value })
            }
            placeholder="Payment terms..."
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : invoice ? "Update Invoice" : "Create Invoice"}
      </Button>
    </form>
  );
}
