"use client";

import { MobileDrawer } from "@/components/MobileDrawer";
import { SearchInput } from "@/components/SearchInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetStocksForInvoice } from "@/hooks/queryHooks/useFeeInvoice";
import { useIsMobile } from "@/hooks/useIsMobile";
import useDebounce from "@/hooks/useDebounce";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { InvoiceItem } from "./NewInvoiceMobileItem";

type Props = {
  branchId?: number;
  termId?: number;
  onAddItems: (items: InvoiceItem[]) => void;
};

export const StockSheet = ({ branchId, onAddItems }: Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const debouncedSearch = useDebounce(search, 400);

  const { data, isPending } = useGetStocksForInvoice({ branchId, search: debouncedSearch });
  const stocks = data?.content ?? [];

  const handleAdd = (stockId: number) => {
    const item = stocks.find(s => s.id === stockId);
    if (!item) return;
    onAddItems([{ id: crypto.randomUUID(), name: item.itemName, qty: 1, price: item.amount, required: false }]);
    setOpen(false);
  };

  const stockStatusBadge = (status: string) => {
    if (status === "OUT_OF_STOCK") return <Badge className="bg-bg-badge-red text-bg-basic-red-strong border-border-default h-5 rounded-md border p-1 text-xs font-medium">Out of Stock</Badge>;
    if (status === "LOW_STOCK") return <Badge className="bg-bg-badge-orange text-bg-basic-orange-strong border-border-default h-5 rounded-md border p-1 text-xs font-medium">Low Stock</Badge>;
    return <Badge className="bg-bg-badge-lime text-bg-basic-lime-strong border-border-default h-5 rounded-md border p-1 text-xs font-medium">In Stock</Badge>;
  };

  const content = (
    <>
      <div className="flex w-full flex-col gap-4 p-4">
        <SearchInput
          className="bg-bg-input-soft border-border-default border"
          placeholder="Search stock items"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex flex-col gap-3 overflow-y-auto max-h-96">
          {isPending ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="bg-bg-input-soft h-20 w-full rounded-md" />)
          ) : stocks.length === 0 ? (
            <p className="text-text-muted text-center text-sm py-4">No stock items found</p>
          ) : (
            stocks.map(sf => (
              <div key={sf.id} className="border-border-darker bg-bg-card rounded-md border p-4">
                <div className="flex w-full items-start gap-2.5">
                  <Image
                    src={sf.image || "/staff/images/noImage.png"}
                    alt={sf.itemName}
                    width={32}
                    height={32}
                    className="border-border-default rounded-full border"
                  />
                  <div className="w-full">
                    <div className="border-border-default flex w-full flex-col gap-2 border-b pb-3">
                      <div className="flex w-full items-center justify-between">
                        <div className="text-text-default text-sm font-medium">{sf.itemName}</div>
                        <Badge className="text-bg-basic-lime-strong border-border-default bg-bg-badge-lime h-5 rounded-md border p-1 text-xs font-medium">
                          {sf.quantity} items
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-text-muted text-sm font-medium">₦{sf.amount.toLocaleString()}</div>
                        {stockStatusBadge(sf.stockStatus)}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAdd(sf.id)}
                      disabled={sf.stockStatus === "OUT_OF_STOCK"}
                      className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! mt-3 flex h-8 w-30 items-center gap-1 rounded-sm"
                    >
                      Add to Invoice
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <SheetFooter className="border-border-default border-t">
        <div className="flex items-center justify-between p-4">
          <SheetClose asChild>
            <Button variant="outline" className="bg-bg-state-soft! text-text-subtle hover:text-text-subtle! h-7 border-none px-2 py-1">
              Close
            </Button>
          </SheetClose>
        </div>
      </SheetFooter>
    </>
  );

  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
        className="bg-bg-state-secondary! border-border-darker text-text-default flex h-8 w-full cursor-pointer items-center justify-center rounded-md border text-sm font-medium"
      >
        Select from Stock <ChevronDown className="text-icon-default-muted hidden size-4 md:block" />
      </Button>

      {!isMobile && (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent className="bg-bg-card border-border-default mx-4 mt-4 hidden w-full overflow-y-auto rounded-md border md:block md:min-w-130">
            <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
              <VisuallyHidden><SheetTitle>Select Stock Items</SheetTitle></VisuallyHidden>
              <div className="text-text-default text-md font-semibold">Select Stock Items</div>
            </SheetHeader>
            {content}
          </SheetContent>
        </Sheet>
      )}

      {isMobile && (
        <MobileDrawer open={open} setIsOpen={setOpen} title="Select Stock Items">
          {content}
        </MobileDrawer>
      )}
    </div>
  );
};
