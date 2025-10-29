import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SelectTrigger, Select, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar, Ellipsis, Eye, Printer, Trash2, Check, X, TriangleAlert, CheckCheck } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@radix-ui/react-dropdown-menu";

const invoices = [
  { id: 0, title: "INV-2025-1001", issueDate: "30/5/2024", status: "Paid" },
  { id: 1, title: "INV-2025-1002", issueDate: "30/5/2024", status: "Unpaid" },
  { id: 2, title: "INV-2025-1003", issueDate: "30/5/2024", status: "Outstanding" },
  { id: 3, title: "INV-2025-1004", issueDate: "30/5/2024", status: "Fully Paid" },
  { id: 4, title: "INV-2025-1005", issueDate: "30/5/2024", status: "Paid" },
];

const termsOptions = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];

export default function StudentInvoiceTable() {
  const [termSelected, setTermSelected] = useState(termsOptions[0]);

  const getStatusStyle = status => {
    switch (status) {
      case "Paid":
        return { bg: "bg-bg-badge-green text-green-700", icon: <Check className="size-4" /> };
      case "Unpaid":
        return { bg: "bg-bg-badge-red text-red-700", icon: <X className="size-4" /> };
      case "Outstanding":
        return { bg: "bg-bg-badge-orange text-orange-700", icon: <TriangleAlert className="size-4" /> };
      case "Fully Paid":
        return { bg: "bg-bg-badge-lime text-lime-700 ", icon: <CheckCheck className="size-4" /> };
      default:
        return { bg: "bg-gray-100 text-gray-700", icon: null };
    }
  };

  return (
    <>
      <div className="my-4 flex items-center justify-between">
        <h2 className="text-text-default text-lg font-semibold">Student Invoices</h2>
        <Select value={termSelected} onValueChange={setTermSelected}>
          <SelectTrigger className="border-border-darker h-8 w-auto border focus-visible:ring-0">
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
        <Table>
          <TableHeader>
            <TableRow className="border-border-default border-b text-sm font-semibold text-gray-600">
              <TableHead>Invoice ID</TableHead>
              <TableHead>Issued Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {invoices.map(invoice => {
              const { bg, icon } = getStatusStyle(invoice.status);
              return (
                <TableRow key={invoice.id} className="border-border-default border-b">
                  <TableCell className="text-text-default text-sm font-medium">{invoice.title}</TableCell>
                  <TableCell className="text-text-muted">{invoice.issueDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`border-border-default rounded-sm border-1 ${bg} flex items-center gap-2 text-sm font-medium`}
                    >
                      {icon} {invoice.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-text-muted cursor-pointer">
                          <Ellipsis className="size-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-bg-card border-border-default w-[192px] rounded-sm border shadow-sm">
                        <DropdownMenuItem className="text-text-default hover:bg-bg-muted flex cursor-pointer items-center gap-2 p-2 text-sm">
                          <Eye className="size-4" /> View invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-text-default hover:bg-bg-muted flex cursor-pointer items-center gap-2 p-2 text-sm">
                          <Printer className="size-4" /> Print receipt
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-bg-muted flex cursor-pointer items-center gap-2 p-2 text-sm text-red-600">
                          <Trash2 className="size-4" /> Delete invoice
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="flex flex-col gap-4 md:hidden">
        {invoices.map(invoice => {
          const { bg, icon } = getStatusStyle(invoice.status);
          return (
            <div key={invoice.id} className="border-border-default bg-bg-card rounded-md border py-4">
              <div className="mb-3 flex items-center justify-between px-4">
                <span className="text-text-default text-sm font-semibold">{invoice.title}</span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-text-muted cursor-pointer p-1">
                      <Ellipsis className="size-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-bg-card border-border-default w-[192px] rounded-sm border shadow-sm">
                    <DropdownMenuItem className="text-text-default hover:bg-bg-muted flex items-center gap-2 p-2 text-sm">
                      <Eye className="size-4" /> View Invoice
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-text-default hover:bg-bg-muted flex items-center gap-2 p-2 text-sm">
                      <Printer className="size-4" /> Print receipt
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-bg-muted flex items-center gap-2 p-2 text-sm text-red-600">
                      <Trash2 className="size-4" /> Delete invoice
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="border-border-default border-t-1">
                <div className="border-border-default flex justify-between border-b-1 p-4 text-sm">
                  <span className="text-text-subtle font-medium">Issued Date:</span>
                  <span className="text-text-default">{invoice.issueDate}</span>
                </div>
              </div>

              <div className="flex justify-between px-4 pt-4 text-sm">
                <span className="text-text-subtle font-medium">Status:</span>
                <Badge variant="outline" className={`rounded-sm border-none ${bg} flex items-center gap-2 text-sm font-medium`}>
                  {icon} {invoice.status}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
