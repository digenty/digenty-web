"use client";

import { ColumnDef, flexRender, getCoreRowModel, Row, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Pagination } from "./Pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalCount: number;
  page: number;
  setCurrentPage: (page: number) => void;
  clickHandler: (row: Row<TData>) => void;
  pageSize: number;
  rowSelection: Record<string, boolean>;
  setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onSelectRows: (data: TData[]) => void;
  showPagination?: boolean;
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  totalCount,
  clickHandler,
  page,
  setCurrentPage,
  pageSize,
  rowSelection,
  setRowSelection,
  onSelectRows,
  showPagination = true,
}: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection, // ✅ tell the table which rows are selected
    },
    rowCount: totalCount,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    initialState: {
      columnVisibility: {
        id: false,
      },
    },
  });

  useEffect(() => {
    if (onSelectRows) {
      const selected = table.getSelectedRowModel().flatRows.map(r => r.original);
      onSelectRows(selected);
    }
  }, [table, rowSelection, onSelectRows]);

  return (
    <div className="space-y-4 pb-12.5">
      <div className="overflow-hidden rounded-md">
        <Table className="w-full">
          <TableHeader className="border-border-default border-y">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="border-border-default border-b">
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} className="pr-7.5">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="border-border-default border-t">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  // data-state={row.getIsSelected() && "selected"}
                  className="border-border-default data-[state=selected]:bg-bg-basic-gray-alpha-2 hover:bg-bg-basic-gray-alpha-2 border-y text-sm"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      style={{ width: cell.column.getSize() }}
                      key={cell.id}
                      className={cn("pr-7.5", cell.column.id === "actions" && "text-right")}
                      onClick={cell.column.id === "actions" ? () => clickHandler(row) : undefined}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <Pagination table={table} currentPage={page} totalPages={Math.ceil(totalCount / pageSize)} setCurrentPage={setCurrentPage} />
      )}
    </div>
  );
};
