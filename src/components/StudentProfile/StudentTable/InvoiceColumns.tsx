"use client";

import Printer from "@/components/Icons/Printer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef, Row } from "@tanstack/react-table";
import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import DeleteBin from "../../Icons/DeleteBin";
import { Invoice } from "../types";
import { getBadge } from "./StudentInvoiceTable";
import { useRouter } from "next/navigation";

const RenderOptions = (row: Row<Invoice>) => {
  const router = useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-border-darker focus-visible:ring-0 focus-visible:outline-none">
        <MoreHorizontalIcon className="text-icon-default-muted size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-bg-card border-border-default text-text-default w-48 py-2.5 shadow-sm">
        <DropdownMenuItem onClick={(evt) => {
          evt.stopPropagation()
          router.push(`/invoices/${row.original.id}`)}
        } className="gap-2.5 px-3">
          <EyeIcon className="text-icon-default-subtle size-4" />
          <span>View invoice</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2.5 px-3">
          <Printer fill="var(--color-icon-default-subtle)" className="size-4" />
          <span>Print receipt</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="border-border-default bg-border-default" />
        <DropdownMenuItem className="gap-2.5 px-3">
          <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
          <span className="text-icon-destructive font-normal">Delete invoice</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoiceId",
    header: () => <div className="text-text-muted text-sm font-medium">Invoice ID</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.title}</span>,
  },
  {
    accessorKey: "issuedDate",
    header: () => <div className="text-text-muted text-sm font-medium">Issued Date</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{row.original.issueDate}</span>,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-text-muted text-sm font-medium">Status</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{getBadge(row.original.status)}</span>,
  },
  {
    id: "actions",
    header: () => <div />,
    cell: ({ row }) => RenderOptions(row),
  },
];
