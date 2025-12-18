"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DeleteBin from "@/components/Icons/DeleteBin";
import { Draggable } from "@/components/Icons/Draggable";

export type InvoiceItem = {
  id: string;
  name: string;
  qty: number;
  price: number;
  required: boolean;
};

type InvoiceItemMobileProps = {
  items: InvoiceItem[];
  subtotal: number;
  onUpdateItem: (id: string, data: Partial<InvoiceItem>) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
};

export const NewInvoiceItemMobile = ({ items, subtotal, onUpdateItem, onAddItem, onRemoveItem }: InvoiceItemMobileProps) => {
  return (
    <div className="flex flex-col gap-4 md:hidden">
      {items.map(item => (
        <div key={item.id} className="border-border-default bg-bg-card flex flex-col gap-4 rounded-md border p-3">
          <div className="flex items-center justify-between gap-4">
            <Input
              placeholder="Item name"
              value={item.name}
              onChange={e => onUpdateItem(item.id, { name: e.target.value })}
              className="bg-bg-input-soft! text-text-muted h-8 border-none text-sm"
            />
            <Button className="bg-bg-input-soft hover:bg-bg-input-soft! flex h-8 w-8 items-center justify-center p-1">
              <Draggable fill="var(--color-icon-default-muted)" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <div className="text-text-default text-sm font-medium">Quantity</div>
              <div className="bg-bg-input-soft flex h-8 items-center justify-between rounded-md">
                <Button
                  onClick={() =>
                    onUpdateItem(item.id, {
                      qty: Math.max(1, item.qty - 1),
                    })
                  }
                  className="text-text-muted bg-none hover:bg-none!"
                >
                  −
                </Button>
                <span className="text-text-default text-sm">{item.qty}</span>
                <Button
                  onClick={() =>
                    onUpdateItem(item.id, {
                      qty: item.qty + 1,
                    })
                  }
                  className="text-text-muted bg-none hover:bg-none!"
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-text-default text-sm font-medium">Unit Price</div>
              <div className="bg-bg-input-soft flex h-8 items-center gap-3 rounded-md px-2">
                <span className="text-text-muted text-sm">₦</span>
                <Input
                  type="number"
                  value={item.price}
                  onChange={e =>
                    onUpdateItem(item.id, {
                      price: Number(e.target.value),
                    })
                  }
                  className="text-text-default h-8 border-none p-0 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-text-default text-sm font-medium">Total</div>
            <div className="bg-bg-input-soft flex h-8 items-center rounded-md px-2">
              <span className="text-text-muted mr-1 text-sm">₦</span>
              <span className="text-text-muted text-sm">{(item.qty * item.price).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="bg-bg-state-soft flex h-8 w-full items-center rounded-full px-0.5">
              <Badge
                onClick={() => onUpdateItem(item.id, { required: false })}
                className={cn(
                  "text-text-muted h-7 w-1/2 cursor-pointer rounded-full px-3 text-sm font-medium transition",
                  !item.required ? "bg-bg-state-secondary text-text-default border-border-darker border font-medium" : "opacity-40",
                )}
              >
                Optional
              </Badge>

              <Badge
                onClick={() => onUpdateItem(item.id, { required: true })}
                className={cn(
                  "h-7 w-1/2 cursor-pointer rounded-full px-3 text-sm font-medium transition",
                  item.required ? "bg-bg-basic-fuchsia-accent text-text-white-default" : "opacity-40",
                )}
              >
                Required
              </Badge>
            </div>

            <Button
              onClick={() => onRemoveItem(item.id)}
              className="bg-bg-input-soft hover:bg-bg-input-soft! flex h-8 w-8 cursor-pointer items-center justify-center p-1"
            >
              <DeleteBin fill="var(--color-icon-default-subtle)" />
            </Button>
          </div>
        </div>
      ))}

      <div className="flex justify-between px-1 text-sm">
        <span className="text-text-subtle font-medium">Subtotal</span>
        <span className="text-text-default font-medium">₦{subtotal.toLocaleString()}</span>
      </div>

      <Button
        onClick={onAddItem}
        className="bg-bg-state-secondary! hover:bg-bg-state-secondary! border-border-default text-text-default flex w-full items-center justify-center gap-1.5 border border-dashed px-3.5 py-2.5 text-sm font-medium"
      >
        <Plus className="size-4" /> Add Item
      </Button>
    </div>
  );
};
