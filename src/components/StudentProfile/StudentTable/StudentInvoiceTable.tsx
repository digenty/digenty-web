import { DataTable } from "@/components/DataTable";
import Printer from "@/components/Icons/Printer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Calendar, Check, CheckCheck, Ellipsis, Eye, Trash2, TriangleAlert, X } from "lucide-react";
import { useState } from "react";
import { Invoice } from "../types";
import { columns } from "./InvoiceColumns";
import { Draft } from "@/components/Icons/Draft";

const invoices = [
  { id: 0, title: "INV-2025-1001", issueDate: "30/5/2024", status: "Paid" },
  { id: 1, title: "INV-2025-1002", issueDate: "30/5/2024", status: "Unpaid" },
  { id: 2, title: "INV-2025-1003", issueDate: "30/5/2024", status: "Outstanding" },
  { id: 3, title: "INV-2025-1004", issueDate: "30/5/2024", status: "Fully Paid" },
  { id: 4, title: "INV-2025-1005", issueDate: "30/5/2024", status: "Paid" },
  { id: 5, title: "INV-2025-1005", issueDate: "30/5/2024", status: "Unpaid" },
  { id: 6, title: "INV-2025-1005", issueDate: "30/5/2024", status: "Paid" },
  { id: 7, title: "INV-2025-1005", issueDate: "30/5/2024", status: "Outstanding" },
  { id: 8, title: "INV-2025-1005", issueDate: "30/5/2024", status: "Paid" },
];

const termsOptions = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];

export const getBadge = (status: string) => {
  switch (status) {
    case "Paid":
      return (
        <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default rounded-md text-xs font-medium">
          <Check className="size-3" />
          <span>Paid</span>
        </Badge>
      );
    case "Unpaid":
      return (
        <Badge className="bg-bg-badge-red text-bg-basic-red-strong border-border-default rounded-md text-xs font-medium">
          <X className="size-3" />
          <span>Unpaid</span>
        </Badge>
      );
    case "Outstanding":
      return (
        <Badge className="bg-bg-badge-orange text-bg-basic-orange-strong border-border-default rounded-md text-xs font-medium">
          <TriangleAlert className="size-3" />
          <span>Outstanding</span>
        </Badge>
      );
    case "Fully Paid":
      return (
        <Badge className="bg-bg-badge-lime text-bg-basic-lime-strong border-border-default rounded-md text-xs font-medium">
          <CheckCheck className="size-3" />
          <span>Fully Paid</span>
        </Badge>
      );
    case "Draft":
      return (
        <Badge className="border-border-default bg-bg-badge-default text-text-subtle rounded-md text-xs font-medium">
          <Draft className="size-3" fill="var(--color-icon-default-muted)" />
          <span>Draft</span>
        </Badge>
      );
    default:
      return (
        <Badge className="bg-bg-red-green text-bg-basic-red-strong border-border-default rounded-md text-xs font-medium">
          <X className="size-3" />
          <span>Unpaid</span>
        </Badge>
      );
  }
};

export default function StudentInvoiceTable() {
  const [termSelected, setTermSelected] = useState(termsOptions[0]);
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<Invoice[]>([]);
  console.log(selectedRows);
  const pageSize = 10;

  return (
    <div className="space-y-4 md:space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-text-default text-lg font-semibold">Student Invoices</h2>
        <Select value={termSelected} onValueChange={setTermSelected}>
          <SelectTrigger className="border-border-darker h-7! w-auto border focus-visible:ring-0 md:h-8!">
            <SelectValue>
              <div className="flex items-center gap-2">
                <Calendar className="text-icon-black-muted size-4" />
                <span className="text-text-default text-sm font-semibold">{termSelected}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default">
            {termsOptions.map(term => (
              <SelectItem key={term} value={term} className="text-text-default text-sm font-semibold">
                {term}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* desktop table */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={invoices}
          totalCount={invoices.length}
          page={page}
          setCurrentPage={setPage}
          pageSize={pageSize}
          clickHandler={row => {
            console.log(row);
            // setIsDetailsOpen(true);
            // setSelectedRole(row.original);
          }}
          showPagination={false}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onSelectRows={setSelectedRows}
        />
      </div>

      {/* Mobile View */}
      <div className="flex flex-col gap-4 md:hidden">
        {invoices.map(invoice => {
          return (
            <div key={invoice.id} className="border-border-default bg-bg-card rounded-md border">
              <div className="flex h-[38px] items-center justify-between px-3 py-1.5">
                <span className="text-text-default text-sm font-medium">{invoice.title}</span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="text-text-muted cursor-pointer p-0! focus-visible:ring-0!">
                      <Ellipsis className="size-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-bg-card border-border-default w-[192px] rounded-sm border shadow-sm">
                    <DropdownMenuItem className="text-text-default hover:bg-bg-muted flex items-center gap-2 p-2 text-sm">
                      <Eye className="size-4" /> View Invoice
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-text-default hover:bg-bg-muted flex items-center gap-2 p-2 text-sm">
                      <Printer fill="var(--color-icon-default-subtle)" className="size-4" /> Print receipt
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-bg-muted flex items-center gap-2 p-2 text-sm text-red-600">
                      <Trash2 className="size-4" /> Delete invoice
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="border-border-default border-t-1">
                <div className="border-border-default flex justify-between border-b-1 px-3 py-2 text-sm">
                  <span className="text-text-muted font-medium">Issued Date:</span>
                  <span className="text-text-muted font-normal">{invoice.issueDate}</span>
                </div>
              </div>

              <div className="flex justify-between px-3 py-2 text-sm">
                <span className="text-text-muted font-medium">Status:</span>
                {getBadge(invoice.status)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
