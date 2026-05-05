"use client";

import { ArrowDownS } from "@digenty/icons";
import { MobileDrawer } from "@/components/MobileDrawer";
import { SearchInput } from "@/components/SearchInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetFeesForInvoice } from "@/hooks/queryHooks/useFeeInvoice";
import { useIsMobile } from "@/hooks/useIsMobile";
import useDebounce from "@/hooks/useDebounce";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { FeeInvoiceItem } from "@/api/fee";
import type { InvoiceItem } from "./NewInvoiceMobileItem";

type Props = {
  branchId?: number;
  termId?: number;
  onAddItems: (items: InvoiceItem[]) => void;
};

export const FeesSheet = ({ branchId, termId, onAddItems }: Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openFeeId, setOpenFeeId] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<Map<number, FeeInvoiceItem>>(new Map());
  const isMobile = useIsMobile();

  const debouncedSearch = useDebounce(search, 400);
  const { data: fees, isPending } = useGetFeesForInvoice({ branchId, termId, search: debouncedSearch });
  const feeList = Array.isArray(fees) ? fees : [];

  const toggleFeeItem = (item: FeeInvoiceItem, checked: boolean) => {
    setSelectedItems(prev => {
      const next = new Map(prev);
      if (checked) next.set(item.id, item);
      else next.delete(item.id);
      return next;
    });
  };

  const handleDone = () => {
    const newItems: InvoiceItem[] = Array.from(selectedItems.values()).map(item => ({
      id: crypto.randomUUID(),
      name: item.name,
      qty: 1,
      price: item.amount,
      required: item.required,
    }));
    onAddItems(newItems);
    setSelectedItems(new Map());
    setOpen(false);
  };

  const content = (
    <>
      <div className="flex w-full flex-col gap-4 p-4">
        <SearchInput
          className="bg-bg-input-soft border-border-default border"
          placeholder="Search fees"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex flex-col gap-3 overflow-y-auto max-h-96">
          {isPending ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="bg-bg-input-soft h-20 w-full rounded-md" />)
          ) : feeList.length === 0 ? (
            <p className="text-text-muted text-center text-sm py-4">No fees found</p>
          ) : (
            feeList.map(fee => (
              <div key={fee.id} className="border-border-darker bg-bg-card rounded-md border p-4">
                <div className="flex w-full items-start gap-2.5">
                  <div
                    className="bg-bg-state-soft flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm p-1 shrink-0"
                    onClick={() => setOpenFeeId(prev => (prev === fee.id ? null : fee.id))}
                  >
                    <ArrowDownS
                      fill="var(--color-icon-default-muted)"
                      className={`transition-transform ${openFeeId === fee.id ? "" : "rotate-270"}`}
                    />
                  </div>
                  <div className="w-full">
                    <div className="border-border-default flex w-full flex-col gap-1 border-b pb-3">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-text-default text-sm font-medium">{fee.classStudent}</span>
                          <span className="text-text-muted text-sm">{fee.termLabel ? `· ${fee.termLabel}` : ""}</span>
                        </div>
                        <Badge className="text-text-subtle border-border-default h-5 w-14 rounded-md border p-1 text-xs font-medium">
                          {fee.items?.length ?? 0} items
                        </Badge>
                      </div>
                      <div className="text-text-informative text-sm font-medium">₦{fee.totalAmount?.toLocaleString()}</div>
                    </div>

                    {openFeeId === fee.id && (
                      <div className="mt-2 flex flex-col gap-2">
                        {fee.items?.map(item => (
                          <div key={item.id} className="border-border-default flex items-start gap-2.5 border-b py-2">
                            <Checkbox
                              checked={selectedItems.has(item.id)}
                              onCheckedChange={checked => toggleFeeItem(item, !!checked)}
                              className="mt-0.5 shrink-0"
                            />
                            <div className="flex flex-col gap-1">
                              <div className="text-text-default text-sm font-medium">{item.name}</div>
                              <Badge className="text-text-subtle border-border-default h-5 w-fit rounded-md border p-1 text-xs font-medium">
                                {item.required ? "Required" : "Optional"}
                              </Badge>
                              <div className="text-text-muted text-sm">₦{item.amount?.toLocaleString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
          <Button
            onClick={handleDone}
            disabled={selectedItems.size === 0}
            className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! flex h-7 items-center gap-1 rounded-sm px-2 py-1"
          >
            Add {selectedItems.size > 0 ? `(${selectedItems.size})` : ""} to Invoice
          </Button>
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
        Select from Fees <ChevronDown className="text-icon-default-muted hidden size-4 md:block" />
      </Button>

      {!isMobile && (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent className="bg-bg-card border-border-default mt-4 mr-4 hidden overflow-y-auto rounded-md border md:block md:min-w-130">
            <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
              <VisuallyHidden><SheetTitle>Select from Fees</SheetTitle></VisuallyHidden>
              <div className="text-text-default text-md font-semibold">Select from Fees</div>
            </SheetHeader>
            {content}
          </SheetContent>
        </Sheet>
      )}

      {isMobile && (
        <MobileDrawer open={open} setIsOpen={setOpen} title="Select from Fees">
          {content}
        </MobileDrawer>
      )}
    </div>
  );
};
