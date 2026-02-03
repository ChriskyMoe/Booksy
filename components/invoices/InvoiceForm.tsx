"use client";

import { useState, useEffect } from "react";
import {
  Invoice,
  InvoiceLineItem,
  InvoiceItemWithDetails,
} from "@/types/invoice";
import { createInvoice, updateInvoice } from "@/lib/actions/invoices";
import {
  getInvoiceItems,
  InvoiceItemCatalog,
} from "@/lib/actions/invoiceItems";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Check, Loader2, Package } from "lucide-react";

interface InvoiceFormProps {
  invoice?: Invoice;
  onSubmit?: (invoice: Invoice) => void;
}

export default function InvoiceForm({ invoice, onSubmit }: InvoiceFormProps) {
  const [loading, setLoading] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItemCatalog[]>([]);

  // Initialize items with catalog details for display (use invoice.items if available)
  const [items, setItems] = useState<InvoiceItemWithDetails[]>(
    invoice?.items || []
  );
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

  useEffect(() => {
    loadInvoiceItems();
  }, []);

  const loadInvoiceItems = async () => {
    const result = await getInvoiceItems();
    if (result.data) {
      setInvoiceItems(result.data);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * formData.tax_rate) / 100;
  const total = subtotal + taxAmount;

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        catalogItemId: "",
        quantity: 1,
        name: "",
        unit_price: 0,
        amount: 0,
      },
    ]);
  };

  const handleSelectInvoiceItem = (index: number, itemId: string) => {
    const invoiceItem = invoiceItems.find((i) => i.id === itemId);
    if (invoiceItem) {
      const newItems = [...items];
      newItems[index] = {
        catalogItemId: invoiceItem.id,
        quantity: newItems[index].quantity,
        name: invoiceItem.name,
        description: invoiceItem.description,
        unit_price: invoiceItem.unit_price,
        unit: invoiceItem.unit,
        amount: newItems[index].quantity * invoiceItem.unit_price,
      };
      setItems(newItems);
    }
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
      // Convert display items to line items for database
      const invoice_line_items: InvoiceLineItem[] = items.map((item) => ({
        catalogItemId: item.catalogItemId,
        quantity: item.quantity,
      }));

      const data = {
        ...formData,
        subtotal,
        tax_amount: taxAmount,
        total_amount: total,
        invoice_line_items,
        description: "",
      };

      if (invoice) {
        await updateInvoice(invoice.id, data as any);
        onSubmit?.(invoice); // Call onSubmit callback after update
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
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        {/* Column Headers */}
        {items.length > 0 && (
          <div className="grid grid-cols-4 gap-2 px-2 mb-2">
            <div className="text-sm font-semibold text-gray-700">Item</div>
            <div className="text-sm font-semibold text-gray-700">Quantity</div>
            <div className="text-sm font-semibold text-gray-700">
              Unit Price
            </div>
            <div className="text-sm font-semibold text-gray-700">Amount</div>
          </div>
        )}

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 items-end">
              <div>
                <Select
                  value={item.catalogItemId || ""}
                  onValueChange={(value) =>
                    handleSelectInvoiceItem(index, value)
                  }
                >
                  <SelectTrigger>
                    {item.catalogItemId ? (
                      <span>{item.name}</span>
                    ) : (
                      <SelectValue placeholder="Select item..." />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {invoiceItems.map((invoiceItem) => (
                      <SelectItem key={invoiceItem.id} value={invoiceItem.id}>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <div>
                            <div className="font-medium">
                              {invoiceItem.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ${invoiceItem.unit_price} / {invoiceItem.unit}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "quantity",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={item.unit_price}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div className="flex gap-2">
                <Input
                  disabled
                  value={item.amount.toFixed(2)}
                  className="bg-gray-100"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="inline-flex items-center justify-center rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                  title="Remove item"
                >
                  <X className="w-4 h-4" />
                </button>
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

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            {invoice ? "Update Invoice" : "Create Invoice"}
          </>
        )}
      </button>
    </form>
  );
}
