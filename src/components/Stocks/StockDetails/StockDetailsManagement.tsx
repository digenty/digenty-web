"use client";

import { DataTable } from "@/components/DataTable";
import React, { useState } from "react";
import { StockQuantityManagementItems, StockQuantityManagementProps } from "./type";
import { StocksQuantityManagementColumns } from "./Columns";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "@/components/Icons/ArrowUpDown";
import { StockDetailsAdjustQtyModal } from "./StockDetailsAdjustQtyModal";

export const StockDetailsManagement = () => {
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<StockQuantityManagementProps[]>([]);
  const [adjustQty, setAdjustQty] = useState(false);
  const pageSize = 8;
  return (
    <>
      {adjustQty && <StockDetailsAdjustQtyModal open={adjustQty} setOpen={setAdjustQty} />}
      <div className="flex flex-col gap-3 md:h-full md:flex-row">
        <div className="border-border-default flex w-full flex-1 flex-col gap-6 rounded-sm border p-4">
          <div className="text-text-default text-sm font-semibold">Quantity Management</div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="text-text-muted text-sm">Current Quantity</div>
              <div className="text-text-default text-2xl font-semibold">89</div>
            </div>
            <Button onClick={() => setAdjustQty(true)} className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8!">
              <ArrowUpDown fill="var(--color-icon-white-default)" />
              Adjust Quantity
            </Button>
          </div>

          <div className="hidden md:block">
            <DataTable
              columns={StocksQuantityManagementColumns}
              data={StockQuantityManagementItems}
              totalCount={StockQuantityManagementItems.length}
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

        {/* Itrems Details */}

        <div className="border-border-default flex h-full w-full flex-col gap-5 rounded-sm border p-4 md:w-118">
          <div className="text-text-default text-sm font-semibold">Item Details</div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="text-text-muted text-sm">Lawanson Price</div>
              <div className="text-text-default text-md font-medium">₦50,000</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-text-muted text-sm">Cost Price</div>
              <div className="text-text-default text-md font-medium">₦50,000</div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-text-muted text-sm">Ilasamaja Price</div>
            <div className="text-text-default text-md font-medium">₦50,000</div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-text-muted text-sm">Unit</div>
            <div className="text-text-default text-md font-medium">Pcs</div>
          </div>

          <div className="border-border-default border-b"></div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="text-text-muted text-sm">Last Modified Lawanson </div>
              <div className="text-text-default text-md font-medium">24/10/2024</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-text-muted text-sm">Date Added Lawanson </div>
              <div className="text-text-default text-md font-medium">24/10/2024</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="text-text-muted text-sm">Last Modified Lawanson </div>
              <div className="text-text-default text-md font-medium">24/10/2024</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-text-muted text-sm">Date Added Lawanson </div>
              <div className="text-text-default text-md font-medium">24/10/2024</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
