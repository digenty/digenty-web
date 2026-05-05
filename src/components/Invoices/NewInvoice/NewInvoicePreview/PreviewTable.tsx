"use client";

import { DataTable } from "@/components/DataTable";
import React, { useState } from "react";
import { previewColumns } from "./PreviewColumn";
import type { InvoiceItem } from "../NewInvoiceItems/NewInvoiceMobileItem";

export interface PreviewProps {
  id: string | number;
  item: string;
  qty: number;
  price: number;
  total: number;
  status: string;
}

export const PreviewTable = ({ items }: { items: InvoiceItem[] }) => {
  const [rowSelection, setRowSelection] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const data: PreviewProps[] = items
    .filter(i => i.name.trim())
    .map(item => ({
      id: item.id,
      item: item.name,
      qty: item.qty,
      price: item.price,
      total: item.qty * item.price,
      status: item.required ? "Required" : "Optional",
    }));

  const requiredFee = data.filter(i => i.status === "Required").reduce((acc, i) => acc + i.total, 0);
  const totalFee = data.reduce((acc, i) => acc + i.total, 0);

  return (
    <div>
      <DataTable
        columns={previewColumns}
        data={data}
        totalCount={data.length}
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
          <span className="text-text-default text-sm font-semibold">₦{requiredFee.toLocaleString()}</span>
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
