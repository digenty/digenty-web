"use client";

import { QuickReferenceAll } from "@digenty/icons";
import { MobileDrawer } from "@/components/MobileDrawer";
import { SearchInput } from "@/components/SearchInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetFeeGroupsForInvoice } from "@/hooks/queryHooks/useFeeInvoice";
import { useIsMobile } from "@/hooks/useIsMobile";
import useDebounce from "@/hooks/useDebounce";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { FeeGroupPickerItem } from "@/api/fee";
import type { InvoiceItem } from "./NewInvoiceMobileItem";

type Props = {
  branchId?: number;
  termId?: number;
  onAddItems?: (items: InvoiceItem[]) => void;
};

export const GroupFeesSheet = ({ branchId, onAddItems }: Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<Map<number, FeeGroupPickerItem>>(new Map());
  const isMobile = useIsMobile();

  const debouncedSearch = useDebounce(search, 400);
  const { data: groups, isLoading } = useGetFeeGroupsForInvoice({ branchId, search: debouncedSearch });
  const groupList: FeeGroupPickerItem[] = (groups as unknown as { data?: FeeGroupPickerItem[] })?.data ?? [];

  const toggleGroup = (group: FeeGroupPickerItem, checked: boolean) => {
    setSelectedGroups(prev => {
      const next = new Map(prev);
      if (checked) next.set(group.feeGroupId, group);
      else next.delete(group.feeGroupId);
      return next;
    });
  };

  const handleDone = () => {
    const newItems: InvoiceItem[] = Array.from(selectedGroups.values()).map(group => ({
      id: crypto.randomUUID(),
      name: group.name,
      qty: 1,
      price: group.totalAmount ?? 0,
      required: false,
    }));
    onAddItems?.(newItems);
    setSelectedGroups(new Map());
    setOpen(false);
  };

  const content = (
    <>
      <div className="flex w-full flex-col gap-4 p-4">
        <SearchInput
          className="bg-bg-input-soft border-border-default border"
          placeholder="Search fee groups"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex flex-col gap-3 md:max-h-96 md:overflow-y-auto">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="bg-bg-input-soft h-20 w-full rounded-md" />)
          ) : groupList.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8">
              <QuickReferenceAll stroke="var(--color-icon-default-muted)" />
              <p className="text-text-default text-center text-sm font-medium">No Fee Groups Yet</p>
              <p className="text-text-muted max-w-64 text-center text-xs font-normal">
                {search ? "No fee groups match your search." : "Create a fee group first to select it here."}
              </p>
            </div>
          ) : (
            groupList.map(group => (
              <div
                key={group.feeGroupId}
                role="button"
                onClick={() => toggleGroup(group, !selectedGroups.has(group.feeGroupId))}
                className="border-border-darker bg-bg-card cursor-pointer rounded-md border p-4"
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedGroups.has(group.feeGroupId)}
                    onCheckedChange={checked => toggleGroup(group, !!checked)}
                    onClick={e => e.stopPropagation()}
                    className="mt-0.5 shrink-0"
                  />
                  <div className="flex w-full flex-col gap-1.5">
                    <div className="flex w-full items-center justify-between">
                      <span className="text-text-default text-sm font-medium">{group.name}</span>
                      <span className="text-text-default text-sm font-semibold">₦{(group.totalAmount ?? 0).toLocaleString()}</span>
                    </div>
                    {(group.feeNames?.length ?? 0) > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {group.feeNames.map(name => (
                          <Badge
                            key={name}
                            className="border-border-default bg-bg-badge-default text-text-subtle h-5 rounded-md border p-1 text-xs font-medium"
                          >
                            {name}
                          </Badge>
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
              Cancel
            </Button>
          </SheetClose>
          <Button
            onClick={handleDone}
            disabled={selectedGroups.size === 0}
            className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! flex h-7 items-center gap-1 rounded-sm px-2 py-1"
          >
            Add {selectedGroups.size > 0 ? `(${selectedGroups.size})` : ""} to Invoice
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
        Select from Fee Groups <ChevronDown className="text-icon-default-muted hidden size-4 md:block" />
      </Button>

      {!isMobile && (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent className="bg-bg-card border-border-default my-4 mr-4 hidden overflow-y-auto rounded-md border md:block md:min-w-130">
            <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
              <VisuallyHidden>
                <SheetTitle>Select Fee Groups</SheetTitle>
              </VisuallyHidden>
              <div className="text-text-default text-md font-semibold">Select Fee Groups</div>
            </SheetHeader>
            {content}
          </SheetContent>
        </Sheet>
      )}

      {isMobile && (
        <MobileDrawer open={open} setIsOpen={setOpen} title="Select Fee Groups">
          {content}
        </MobileDrawer>
      )}
    </div>
  );
};
