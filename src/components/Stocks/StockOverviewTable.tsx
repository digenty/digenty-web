"use client";

import React, { useState } from "react";
import { DataTable } from "../DataTable";
import { StocksOverviewTableColumns } from "./Columns";
import { stocksItems, stocksItemsProps } from "./types";
import { Button } from "../ui/button";
import { Ellipsis } from "lucide-react";
import { MobileDrawer } from "../MobileDrawer";
import Eye from "../Icons/Eye";
import Image from "next/image";
import { stockStatus } from "../Status";
import { Badge } from "../ui/badge";
import Edit from "../Icons/Edit";
import { FileCopy } from "../Icons/FileCopy";
import DeleteBin from "../Icons/DeleteBin";
import { useRouter } from "next/navigation";

export const StockOverviewTable = () => {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedRows, setSelectedRows] = useState<stocksItemsProps[]>([]);
  const pageSize = 8;
  return (
    <div>
      <div className="hidden md:block">
        <DataTable
          columns={StocksOverviewTableColumns}
          data={stocksItems}
          totalCount={stocksItems.length}
          page={page}
          setCurrentPage={setPage}
          pageSize={pageSize}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onSelectRows={setSelectedRows}
          clickHandler={row => {
            router.push(`/stock/${row.original.id}`);
          }}
          showPagination={true}
        />
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        {stocksItems.slice(0, visibleCount).map(stock => {
          return (
            <div key={stock.id} className="border-border-default bg-bg-subtle rounded-md border">
              <MobileDrawer open={isOpen} setIsOpen={setIsOpen} title="Actions">
                <div className="flex w-full flex-col gap-4 px-3 py-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm">
                      <Eye className="size-4" fill="var(--color-icon-default-subtle)" /> View stock
                    </div>
                    <div
                      role="button"
                      className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
                    >
                      <Edit fill="var(--color-icon-default-subtle)" className="size-4" /> Edit stock
                    </div>

                    <div className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm">
                      <FileCopy fill="var(--color-icon-default-subtle)" className="size-4" />
                      <span>Duplicate stock</span>
                    </div>
                    <div className="text-text-destructive hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm">
                      <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
                      <span>Delete stock</span>
                    </div>
                  </div>
                </div>
              </MobileDrawer>

              <div className="">
                <div className="border-border-default flex justify-between border-b px-3 py-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Image src="/images/image.png" alt={stock.itemName} width={20} height={20} />
                    <span className="text-text-default text-sm font-medium">{stock.itemName}</span>
                  </div>{" "}
                  <Button onClick={() => setIsOpen(true)} className="text-text-muted cursor-pointer p-0! focus-visible:ring-0!">
                    <Ellipsis className="size-5" />
                  </Button>
                </div>
              </div>

              <div className="">
                <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                  <span className="text-text-muted font-medium">Category</span>
                  <Badge className="text-bg-basic-lime-strong bg-bg-badge-lime border-border-default rounded-md border text-xs font-medium">
                    {stock.category}
                  </Badge>
                </div>
              </div>

              <div className="">
                <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                  <span className="text-text-muted font-medium">Quantity</span>
                  <span className="text-text-default text-sm font-medium">{stock.quantity}</span>
                </div>
              </div>

              <div className="">
                <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                  <span className="text-text-muted font-medium">Amount</span>
                  <span className="text-text-default text-sm font-medium">{stock.amount}</span>
                </div>
              </div>

              <div className="flex justify-between px-3 py-2 text-sm">
                <span className="text-text-muted font-medium">Status</span>
                {stockStatus(stock.status)}
              </div>
            </div>
          );
        })}

        {visibleCount < stocksItems.length && (
          <Button
            onClick={() => setVisibleCount(stocksItems.length)}
            className="bg-bg-state-soft text-text-subtle mx-auto my-2 flex w-39 items-center justify-center rounded-md"
          >
            Load More
          </Button>
        )}
      </div>
    </div>
  );
};
