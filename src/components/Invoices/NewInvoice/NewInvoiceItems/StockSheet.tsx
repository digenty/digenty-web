"use client";

import { MobileDrawer } from "@/components/MobileDrawer";
import { SearchInput } from "@/components/SearchInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useSearchStocks } from "@/hooks/queryHooks/useStock";
import { StockInvoiceItem, StockStatus } from "@/api/stock";
import { Branch } from "@/api/types";
import { unwrapArray } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Props {
  branchId?: number;
}

const STOCK_STATUS_LABEL: Record<StockStatus, string> = {
  IN_STOCK: "In Stock",
  OUT_OF_STOCK: "Out of Stock",
  LOW_STOCK: "Low Stock",
};

function stockStatusBadge(item: StockInvoiceItem) {
  if (item.stockStatus === "OUT_OF_STOCK") {
    return (
      <Badge className="bg-bg-badge-red text-bg-basic-red-strong border-border-default h-5 rounded-md border px-1.5 text-xs font-medium">
        Out of Stock
      </Badge>
    );
  }
  if (item.stockStatus === "LOW_STOCK") {
    return (
      <Badge className="bg-bg-badge-orange text-bg-basic-orange-strong border-border-default h-5 rounded-md border px-1.5 text-xs font-medium">
        Low Stock
      </Badge>
    );
  }
  return (
    <span className="text-text-muted text-xs font-medium">{item.quantity} in stock</span>
  );
}

function StockCard({ item, onAdd }: { item: StockInvoiceItem; onAdd: (item: StockInvoiceItem) => void }) {
  const imgSrc = item.image && item.image.startsWith("http") ? item.image : "/staff/images/noImage.png";

  return (
    <div className="border-border-darker bg-bg-card rounded-md border p-4">
      <div className="flex w-full items-start gap-2.5">
        <Image
          src={imgSrc}
          alt={item.itemName}
          width={40}
          height={40}
          className="border-border-default mt-0.5 rounded-full border object-cover"
        />

        <div className="w-full">
          <div className="border-border-default flex w-full flex-col gap-1.5 border-b pb-4">
            {/* Name row */}
            <div className="flex w-full items-center justify-between gap-2">
              <div className="text-text-default text-sm font-medium">{item.itemName}</div>
              <Badge className="text-bg-basic-lime-strong border-border-default bg-bg-badge-lime h-5 rounded-md border px-1.5 text-xs font-medium">
                {item.quantity} {item.quantity === 1 ? "item" : "items"}
              </Badge>
            </div>

            {/* Price + status row */}
            <div className="flex items-center gap-2">
              <div className="text-text-muted text-sm font-medium">
                ₦{item.amount?.toLocaleString() ?? 0}
              </div>
              {stockStatusBadge(item)}
            </div>
          </div>

          <Button
            onClick={() => onAdd(item)}
            disabled={item.stockStatus === "OUT_OF_STOCK"}
            className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! disabled:bg-bg-state-disabled! mt-4 flex h-8 w-30 items-center gap-1 rounded-sm text-sm"
          >
            Add to Fees
          </Button>
        </div>
      </div>
    </div>
  );
}

function StockList({
  stocks,
  isLoading,
  onAdd,
}: {
  stocks: StockInvoiceItem[];
  isLoading: boolean;
  onAdd: (item: StockInvoiceItem) => void;
}) {
  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <p className="text-text-muted text-sm">No stock items found.</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {stocks.map(item => (
        <StockCard key={item.id} item={item} onAdd={onAdd} />
      ))}
    </div>
  );
}

export const StockSheet = ({ branchId: propBranchId }: Props = {}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page] = useState(0);
  const isMobile = useIsMobile();

  const { data: branchesData } = useGetBranches();
  const branches: Branch[] = unwrapArray<Branch>(branchesData);
  const activeBranchId = propBranchId ?? branches[0]?.id;

  const { data: stockData, isLoading } = useSearchStocks(activeBranchId, search, page);

  const stocks: StockInvoiceItem[] = stockData?.content ?? [];

  const handleAdd = (item: StockInvoiceItem) => {
    // parent components can extend this via a callback prop in future iterations
    setOpen(false);
  };

  const content = (
    <div className="flex w-full flex-col gap-5 p-6">
      <SearchInput
        className="bg-bg-input-soft border-border-default border"
        placeholder="Search stock items"
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
      />
      <StockList stocks={stocks} isLoading={isLoading} onAdd={handleAdd} />
    </div>
  );

  const footer = (
    <div className="flex items-center justify-between">
      <SheetClose asChild>
        <Button variant="outline" className="bg-bg-state-soft! text-text-subtle hover:text-text-subtle! h-7 w-17 border-none px-2 py-1">
          Cancel
        </Button>
      </SheetClose>
      <Button className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! flex h-7 w-17 items-center gap-1 rounded-sm px-2 py-1">
        Done
      </Button>
    </div>
  );

  return (
    <div>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-bg-state-secondary! border-border-darker text-text-default flex h-8 w-full cursor-pointer items-center justify-center rounded-md border text-sm font-medium"
      >
        Select from Stock <ChevronDown className="text-icon-default-muted hidden size-4 md:block" />
      </Button>

      {/* Desktop */}
      {!isMobile && (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent className="bg-bg-card border-border-default mx-4 mt-4 hidden w-full overflow-y-auto rounded-md border md:block md:min-w-130">
            <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
              <VisuallyHidden>
                <SheetTitle>Select Stock Items</SheetTitle>
              </VisuallyHidden>
              <div className="text-text-default text-md font-semibold">Select Stock Items</div>
            </SheetHeader>

            {content}

            <SheetFooter className="border-border-default border-t pb-8 px-6">
              {footer}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}

      {/* Mobile */}
      {isMobile && (
        <MobileDrawer open={open} setIsOpen={setOpen} title="Select Stock Items">
          <div className="overflow-y-auto">{content}</div>
          <SheetFooter className="border-border-default border-t px-4 py-3">
            {footer}
          </SheetFooter>
        </MobileDrawer>
      )}
    </div>
  );
};
