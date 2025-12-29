"use client";

import { DataTable } from "@/components/DataTable";
import React, { useState } from "react";
import { previewColumns } from "./PreviewColumn";

export interface PreviewProps {
  id: string | number;
  item: string;
  qty: number;
  price: number;
  total: number;
  status: string;
}

const PreviewItem: PreviewProps[] = [
  {
    id: 1,
    item: "Item name",
    qty: 1,
    price: 50000,
    total: 50000,
    status: "Required",
  },
];

const PreviewData = Array.from({ length: 5 }, (_, i) =>
  PreviewItem.map((item, idx) => ({
    ...item,
    id: `item-${i}-${idx}`,
  })),
).flat();

export const PreviewTable = () => {
  const [rowSelection, setRowSelection] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalFee = PreviewData.reduce((acc, item) => acc + item.total, 0);
  return (
    <div>
      <DataTable
        columns={previewColumns}
        data={PreviewData}
        totalCount={PreviewData.length}
        page={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        showPagination={false}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        onSelectRows={() => {}}
        clickHandler={() => {}}
      />
      <div className="border-border-default w-full border-b p-2">
        <div className="mr-6 flex justify-end gap-13 text-sm">
          <span className="text-bg-basic-blue-accent text-sm font-medium">Required Fee</span>
          <span className="text-text-default text-sm font-semibold">₦{totalFee.toLocaleString()}</span>
        </div>
      </div>
      <div className="border-border-default w-full border-b p-2">
        <div className="mr-6 flex justify-end gap-20 text-sm">
          <span className="text-text-muted text-sm font-medium">Total Fee</span>
          <span className="text-text-default text-sm font-semibold">₦{totalFee.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
