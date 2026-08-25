"use client";

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
import type { FeePickerItem } from "@/api/fee";
import type { InvoiceItem } from "./NewInvoiceMobileItem";

type Props = {
  branchId?: number;
  termId?: number;
  onAddItems?: (items: InvoiceItem[]) => void;
};

export const FeesSheet = ({ branchId, termId, onAddItems }: Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState<Map<number, FeePickerItem>>(new Map());
  const isMobile = useIsMobile();

  const debouncedSearch = useDebounce(search, 400);
  const { data: fees, isLoading } = useGetFeesForInvoice({ branchId, termId, search: debouncedSearch });
  const feeList: FeePickerItem[] = (fees as unknown as { data?: FeePickerItem[] })?.data ?? [];

  const toggleFeeItem = (item: FeePickerItem, checked: boolean) => {
    setSelectedItems(prev => {
      const next = new Map(prev);
      if (checked) next.set(item.feeItemId, item);
      else next.delete(item.feeItemId);
      return next;
    });
  };

  const handleDone = () => {
    const newItems: InvoiceItem[] = Array.from(selectedItems.values()).map(item => ({
      id: crypto.randomUUID(),
      name: item.feeName,
      qty: item.quantity,
      price: item.amount,
      required: item.required,
    }));
    onAddItems?.(newItems);
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
        <div className="flex flex-col gap-3 md:max-h-96 md:overflow-y-auto">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="bg-bg-input-soft h-16 w-full rounded-md" />)
          ) : feeList.length === 0 ? (
            <p className="text-text-muted py-4 text-center text-sm">No fees found</p>
          ) : (
            feeList.map(fee => (
              <div
                key={fee.feeItemId}
                role="button"
                onClick={() => toggleFeeItem(fee, !selectedItems.has(fee.feeItemId))}
                className="border-border-darker bg-bg-card cursor-pointer rounded-md border p-4"
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedItems.has(fee.feeItemId)}
                    onCheckedChange={checked => toggleFeeItem(fee, !!checked)}
                    onClick={e => e.stopPropagation()}
                    className="mt-0.5 shrink-0"
                  />
                  <div className="flex w-full flex-col gap-1">
                    <div className="flex w-full items-center justify-between">
                      <span className="text-text-default text-sm font-medium">{fee.feeName}</span>
                      <span className="text-text-default text-sm font-semibold">₦{fee.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge
                        className={
                          fee.required
                            ? "bg-bg-badge-red text-bg-basic-red-strong border-border-default h-5 rounded-md border p-1 text-xs font-medium"
                            : "bg-bg-badge-lime text-bg-basic-lime-strong border-border-default h-5 rounded-md border p-1 text-xs font-medium"
                        }
                      >
                        {fee.required ? "Required" : "Optional"}
                      </Badge>
                      {fee.allowPartPayment && fee.minimumPartPayment != null && (
                        <Badge className="bg-bg-badge-orange text-bg-basic-orange-strong border-border-default h-5 rounded-md border p-1 text-xs font-medium">
                          Part pay min ₦{fee.minimumPartPayment.toLocaleString()}
                        </Badge>
                      )}
                    </div>
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
        type="button"
        onClick={() => setOpen(true)}
        className="bg-bg-state-secondary! border-border-darker text-text-default flex h-8 w-full cursor-pointer items-center justify-center rounded-md border text-sm font-medium"
      >
        Select from Fees <ChevronDown className="text-icon-default-muted hidden size-4 md:block" />
      </Button>

      {!isMobile && (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent className="bg-bg-card border-border-default mt-4 mr-4 hidden overflow-y-auto rounded-md border md:block md:min-w-130">
            <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
              <VisuallyHidden>
                <SheetTitle>Select from Fees</SheetTitle>
              </VisuallyHidden>
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
