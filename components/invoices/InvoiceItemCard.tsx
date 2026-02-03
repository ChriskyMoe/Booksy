"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Package } from "lucide-react";
import { InvoiceItemCatalog } from "@/lib/actions/invoiceItems";

interface InvoiceItemCardProps {
  item: InvoiceItemCatalog;
  onEdit: () => void;
  onDelete: () => void;
}

export default function InvoiceItemCard({
  item,
  onEdit,
  onDelete,
}: InvoiceItemCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            {item.category && (
              <span className="text-xs text-muted-foreground">
                {item.category}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {item.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {item.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t">
        <div>
          <div className="text-2xl font-bold">
            ${item.unit_price.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">per {item.unit}</div>
        </div>
      </div>
    </Card>
  );
}
