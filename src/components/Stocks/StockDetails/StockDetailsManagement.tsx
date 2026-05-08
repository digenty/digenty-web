"use client";

import { ArrowUpDown } from "@digenty/icons";
import { useMemo, useState } from "react";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";

import { StocksQuantityManagementColumns } from "./Columns";
import { StockDetailsAdjustQtyModal } from "./StockDetailsAdjustQtyModal";
import { StockBranchEntry, StockDetailResponse } from "./type";

type Props = {
  stock?: StockDetailResponse | null;
};

const formatDate = (raw?: string) => {
  if (!raw) return "-";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-GB", { year: "numeric", month: "2-digit", day: "2-digit" });
};

export const StockDetailsManagement = ({ stock }: Props) => {
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [, setSelectedRows] = useState<StockBranchEntry[]>([]);
  const [adjustQty, setAdjustQty] = useState(false);
  const pageSize = 8;

  const branchEntries: StockBranchEntry[] = useMemo(() => {
    const list = stock?.branchStocks ?? stock?.branches ?? [];
    if (Array.isArray(list) && list.length > 0) return list;
    if (stock?.branchName || stock?.branch?.name) {
      return [
        {
          branchId: stock.branchId,
          branchName: stock.branchName ?? stock.branch?.name,
          location: stock.branchName ?? stock.branch?.name,
          quantity: stock.quantity ?? 0,
          amount: stock.price ?? 0,
          stockStatus: stock.stockStatus ?? stock.status,
        },
      ];
    }
    return [];
  }, [stock]);

  const currentQty = stock?.totalQuantity ?? stock?.quantity ?? 0;
  const branchName = stock?.branchName ?? stock?.branch?.name;
  const unitName = stock?.unit?.name ?? stock?.unitName;

  return (
    <>
      {adjustQty && stock?.id && (
        <StockDetailsAdjustQtyModal
          open={adjustQty}
          setOpen={setAdjustQty}
          stockId={stock.id}
          stockName={stock.name ?? stock.itemName}
          stockImage={stock.imagePath ?? stock.image}
          branchName={branchName}
          unitName={unitName}
          currentQuantity={currentQty}
        />
      )}

      <div className="flex flex-col gap-3 md:h-full md:flex-row">
        <div className="border-border-default flex w-full flex-1 flex-col gap-6 rounded-sm border p-4">
          <div className="text-text-default text-sm font-semibold">Quantity Management</div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="text-text-muted text-sm">Current Quantity</div>
              <div className="text-text-default text-2xl font-semibold">{currentQty}</div>
            </div>
            <Button
              onClick={() => setAdjustQty(true)}
              disabled={!stock?.id}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8!"
            >
              <ArrowUpDown fill="var(--color-icon-white-default)" />
              Adjust Quantity
            </Button>
          </div>

          <div className="hidden md:block">
            <DataTable
              columns={StocksQuantityManagementColumns}
              data={branchEntries}
              totalCount={branchEntries.length}
              page={page}
              setCurrentPage={setPage}
              pageSize={pageSize}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              onSelectRows={setSelectedRows}
              clickHandler={() => {}}
              showPagination={false}
              border={true}
              headerBg={true}
            />
          </div>
        </div>

        <div className="border-border-default flex h-full w-full flex-col gap-5 rounded-sm border p-4 md:w-118">
          <div className="text-text-default text-sm font-semibold">Item Details</div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="text-text-muted text-sm">{branchName ? `${branchName} Price` : "Price"}</div>
              <div className="text-text-default text-md font-medium">₦{Number(stock?.price ?? 0).toLocaleString()}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-text-muted text-sm">Cost Price</div>
              <div className="text-text-default text-md font-medium">₦{Number(stock?.costPrice ?? 0).toLocaleString()}</div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-text-muted text-sm">Unit</div>
            <div className="text-text-default text-md font-medium">{unitName ?? "-"}</div>
          </div>

          <div className="border-border-default border-b"></div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="text-text-muted text-sm">{branchName ? `Last Modified ${branchName}` : "Last Modified"}</div>
              <div className="text-text-default text-md font-medium">{formatDate(stock?.updatedAt ?? stock?.lastModified)}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-text-muted text-sm">{branchName ? `Date Added ${branchName}` : "Date Added"}</div>
              <div className="text-text-default text-md font-medium">{formatDate(stock?.createdAt ?? stock?.dateAdded)}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
