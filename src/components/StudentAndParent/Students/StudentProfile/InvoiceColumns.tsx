"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StudentInvoiceEntry } from "@/api/invoice";
import { formatInvoiceStatus, formatNaira } from "@/components/Invoices/types";
import { getBadge } from "./StudentInvoiceTable";

export const columns: ColumnDef<StudentInvoiceEntry>[] = [
  {
    accessorKey: "invoiceNumber",
    header: () => <div className="text-text-muted text-sm font-medium">Invoice ID</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.invoiceNumber}</span>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-text-muted text-sm font-medium">Amount</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">{formatNaira(row.original.amount)}</span>,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-text-muted text-sm font-medium">Status</div>,
    cell: ({ row }) => <span className="cursor-pointer text-sm font-normal">{getBadge(formatInvoiceStatus(row.original.status))}</span>,
  },
  {
    accessorKey: "lastActivity",
    header: () => <div className="text-text-muted text-sm font-medium">Last Activity</div>,
    cell: ({ row }) => (
      <span className="text-text-muted cursor-pointer text-sm font-normal">
        {row.original.lastActivity ? new Date(row.original.lastActivity).toLocaleDateString() : "-"}
      </span>
    ),
  },
];
