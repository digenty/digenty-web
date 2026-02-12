"use client";

import { DataTable } from "@/components/DataTable";
import React, { useState } from "react";
import { StocksHistoryColumns } from "./Columns";
import { StockHistoryList, StockHistoryProps } from "./type";
import { StockHistoryHeader } from "./StockHistoryHeader";
import Eye from "@/components/Icons/Eye";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/ui/badge";

export const StockHistories = () => {
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<StockHistoryProps[]>([]);

  const pageSize = 10;
  return (
    <div className="border-border-default flex flex-col gap-4 rounded-sm border p-4">
      <div className="text-text-default text-sm font-semibold">Stock History</div>
      <StockHistoryHeader />
      <div className="hidden md:block">
        <DataTable
          columns={StocksHistoryColumns}
          data={StockHistoryList}
          totalCount={StockHistoryList.length}
          page={page}
          setCurrentPage={setPage}
          pageSize={pageSize}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onSelectRows={setSelectedRows}
          clickHandler={() => {}}
          showPagination={true}
          border={false}
          headerBg={false}
        />
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        {StockHistoryList.map((stock, i) => {
          return (
            <div key={i} className="border-border-default bg-bg-subtle rounded-md border">
              <div className="">
                <div className="border-border-default flex justify-between border-b px-3 py-1">
                  <div className="text-text-muted text-sm font-medium">Date</div>
                  <div className="text-text-default text-sm font-medium">{stock.date}</div>{" "}
                </div>
              </div>

              <div className="">
                <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                  <span className="text-text-muted font-medium">Change By</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-4" />
                    <div className="text-text-default text-sm font-medium">{stock.changedBy}</div>
                  </div>
                </div>
              </div>

              <div className="">
                <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                  <span className="text-text-muted font-medium">Reason</span>
                  <div className="flex items-center">
                    {" "}
                    <span className="text-text-default text-sm font-medium">{stock.reason}</span>
                    <Badge className="border-border-default text-bg-basic-red-strong bg-bg-badge-red rounded-md border">{stock.change}</Badge>
                  </div>
                </div>
              </div>

              <div className="">
                <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                  <span className="text-text-muted font-medium">Branch</span>
                  <span className="text-text-default text-sm font-medium">{stock.branch}</span>
                </div>
              </div>

              <div className="p-2">
                <Button className="bg-bg-state-secondary! border-border-darker text-text-default h-8! w-full rounded-md border text-sm font-medium">
                  <Eye fill="var(--color-icon-default-muted)" />
                  View
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
