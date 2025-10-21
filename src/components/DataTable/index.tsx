"use client";

import { ColumnDef, flexRender, getCoreRowModel, Row, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import Pagination from "./Pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalCount: number;
  page: number;
  setCurrentPage: (page: number) => void;
  clickHandler: (row: Row<TData>) => void;
  pageSize: number;
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  totalCount,
  clickHandler,
  page,
  setCurrentPage,
  pageSize,
}: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    rowCount: totalCount,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    initialState: {
      columnVisibility: {
        id: false,
      },
    },
  });

  return (
    <div className="space-y-12">
      <div className="overflow-hidden rounded-md">
        <Table className="w-full">
          <TableHeader className="bg-orange-xfaint font-poppins border-border-default border-y">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="border-border-default border-b">
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} className="px-7.5">
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
                  data-state={row.getIsSelected() && "selected"}
                  className="bg-orange-light border-border-default border-y text-base"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="px-7.5" onClick={cell.column.id === "actions" ? () => clickHandler(row) : undefined}>
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

      {/* <Pagination table={table} currentPage={page} totalPages={Math.ceil(totalCount / pageSize)} setCurrentPage={setCurrentPage} /> */}
    </div>
  );
};
