"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Draggable } from "@/components/Icons/Draggable";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DeleteBin from "@/components/Icons/DeleteBin";
import { GroupFeesSheet } from "./GroupFeesSheet";
import { FeesSheet } from "./FeesSheet";
import { StockSheet } from "./StockSheet";
import { NewInvoiceItemMobile } from "./NewInvoiceMobileItem";
import { ArrowDownS } from "@/components/Icons/ArrowDownS";
import { MobileDrawer } from "@/components/MobileDrawer";

type ItemRow = {
  id: string;
  name: string;
  qty: number;
  price: number;
  required: boolean;
};

export const NewInvoiceItem = () => {
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);
  const [items, setItems] = useState<ItemRow[]>([{ id: crypto.randomUUID(), name: "", qty: 1, price: 0, required: false }]);

  const subtotal = items.reduce((acc, item) => acc + item.qty * item.price, 0);

  const updateItem = (id: string, data: Partial<ItemRow>) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, ...data } : i)));
  };

  const addItem = () => {
    setItems(prev => [...prev, { id: crypto.randomUUID(), name: "", qty: 1, price: 0, required: false }]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="">
      <div className="">
        <div className="text-text-default text-normal mb-4 text-lg font-semibold">Invoice Items</div>
        <div className="mb-6">
          <div className="hidden flex-wrap gap-1 md:flex">
            <StockSheet />

            <FeesSheet />

            <GroupFeesSheet />
          </div>
          <div className="flex md:hidden">
            <Button
              onClick={() => setOpenMobileDrawer(true)}
              className="hover:bg-bg-none! border-border-darker text-text-muted flex items-center gap-2 border p-0 px-3 text-sm font-normal"
            >
              <span className="">Select from Stock, Fees and Fee Groups</span>
              <ChevronDown className="text-icon-default-muted size-4" />
            </Button>

            {openMobileDrawer && (
              <MobileDrawer title="Action" open={openMobileDrawer} setIsOpen={setOpenMobileDrawer}>
                <div className="flex flex-col content-center gap-2 p-4">
                  <StockSheet />

                  <FeesSheet />

                  <GroupFeesSheet />
                </div>
              </MobileDrawer>
            )}
          </div>
        </div>

        <div className="border-border-darker hidden w-full overflow-hidden rounded-md border md:block">
          <Table className="w-full rounded-md">
            <TableHeader className="bg-bg-input-soft text-text-muted text-xs font-medium">
              <TableRow className="border-border-default flex h-10 w-full flex-row gap-2 border-b py-3">
                <TableHead className="w-6"></TableHead>
                <TableHead className="w-full max-w-78 text-left">Item</TableHead>
                <TableHead className="w-full max-w-40 text-left">Qty</TableHead>
                <TableHead className="w-full max-w-57 text-left">Unit Price</TableHead>
                <TableHead className="w-full text-left">Total</TableHead>
                {/* <TableHead className="w-full text-left"></TableHead> */}
              </TableRow>
            </TableHeader>

            <TableBody className="[&_tr:first-child]:pt-5">
              {items.map(item => (
                <TableRow key={item.id} className="flex w-full flex-row items-center gap-2 border-none px-4 py-2">
                  <td className="w-6 cursor-grab">
                    <Draggable fill="var(--color-icon-default-muted)" />
                  </td>
                  <td className="bg-bg-input-soft flex h-8! w-full max-w-78 items-center rounded-md">
                    <Input
                      type="text"
                      placeholder="Item Name"
                      value={item.name}
                      onChange={e => updateItem(item.id, { name: e.target.value })}
                      className="text-text-muted flex h-8! items-center border-none text-sm shadow-none"
                    />
                  </td>

                  <td className="bg-bg-input-soft h-8! w-full max-w-40 rounded-md">
                    <Input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={e => updateItem(item.id, { qty: Number(e.target.value) })}
                      className="text-text-muted h-8! rounded-md border-none text-sm shadow-none"
                    />
                  </td>

                  <td className="bg-bg-input-soft h-8! w-full max-w-57 rounded-md px-2">
                    <div className="flex items-center">
                      <span className="text-text-muted text-sm">₦</span>
                      <Input
                        type="number"
                        value={item.price}
                        onChange={e => updateItem(item.id, { price: Number(e.target.value) })}
                        className="text-text-muted h-8! border-none text-sm shadow-none"
                      />
                    </div>
                  </td>

                  <td className="flex w-full items-center justify-between gap-2">
                    <div className="bg-bg-input-soft flex h-8 w-full max-w-78 cursor-not-allowed items-center gap-2 rounded-md px-2">
                      <span className="text-text-muted text-sm">₦</span>
                      <div className="text-text-muted text-sm">{(item.qty * item.price).toLocaleString()}</div>
                    </div>

                    <div className="flex h-8! items-center pr-4">
                      <div className="flex items-center justify-between gap-3">
                        <Switch checked={item.required} onCheckedChange={v => updateItem(item.id, { required: v })} className="scale-90" />
                        <Badge
                          className={cn(
                            "border-border-default h-5 w-16 rounded-md border px-2 py-0.5 text-xs font-medium",
                            item.required ? "bg-bg-badge-fuchsia text-bg-basic-fuchsia-strong" : "text-text-subtle bg-bg-badge-default",
                          )}
                        >
                          {item.required ? "Required" : "Optional"}
                        </Badge>

                        <div className="bg-bg-state-soft flex size-7 cursor-pointer items-center justify-center rounded-md">
                          <DeleteBin fill="var(--color-icon-default-subtle)" onClick={() => removeItem(item.id)} className="size-4" />
                        </div>
                      </div>
                    </div>
                  </td>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between">
            <Button
              onClick={addItem}
              className="text-text-default bg-bg-state-ghost! hover:bg-bg-state-ghost! flex cursor-pointer items-center gap-1.5 px-4 text-sm font-medium"
            >
              <Plus className="text-icon-default-muted size-4" /> Add Item
            </Button>

            <div className="flex items-center justify-end gap-4 py-3 pr-8 pl-4 text-sm">
              <span className="text-text-subtle text-sm font-normal">Subtotal</span>
              <div className="text-text-default text-sm font-medium"> ₦{subtotal.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <NewInvoiceItemMobile items={items} subtotal={subtotal} onUpdateItem={updateItem} onAddItem={addItem} onRemoveItem={removeItem} />
    </div>
  );
};
