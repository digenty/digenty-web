"use client";
import { DeleteBin, Edit, FileCopy } from "@digenty/icons";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef, Row } from "@tanstack/react-table";
import { EyeIcon, MoreHorizontalIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { FeeItemProp } from "./feeItemType";
import { getStatusBadge } from "@/components/Status";

const RenderOptions = ({ row }: { row: Row<FeeItemProp> }) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger onClick={evt => evt.stopPropagation()} className="focus-visible:ring-0 focus-visible:outline-none">
        <MoreHorizontalIcon className="text-icon-default-muted size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-bg-card border-border-default text-text-default py-2.5 shadow-sm">
        <DropdownMenuItem className="hover:bg-bg-state-soft-hover! gap-2.5 px-3">
          <EyeIcon className="text-icon-default-subtle size-4" />
          <span>View fee item</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-bg-state-soft-hover! gap-2.5 px-3">
          <Edit fill="var(--color-icon-default-subtle)" className="size-4" />
          <span>Edit fee item</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-bg-state-soft-hover! gap-2.5 px-3">
          <FileCopy fill="var(--color-icon-default-subtle)" className="size-4" />
          <span>Duplicate fee item</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="border-border-default bg-border-default" />
        <DropdownMenuItem className="hover:bg-bg-state-destructive-hover! gap-2.5 px-3">
          <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
          <span className="text-icon-destructive">Delete fee item</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const FeeItemsColumns: ColumnDef<FeeItemProp>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()}
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label="Select row" />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 30,
  },

  // {
  //   accessorKey: "feeItemId",
  //   header: () => <div className="text-text-muted text-sm font-medium"></div>,
  //   cell: ({ row }) => <span className="text-text-default text-sm">{row.original.feeItemId}</span>,
  // },

  {
    accessorKey: "feeName",
    header: () => <div className="text-text-muted text-sm font-medium">Fee Name</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-medium">{row.original.feeName}</span>,
    size: 100,
  },
  {
    accessorKey: "required",
    header: () => <div className="text-text-muted text-sm font-medium"></div>,
    cell: ({ row }) => <span className="">{getStatusBadge(row.original.required ? "Required" : "Optional")}</span>,
  },

  {
    accessorKey: "quantity",
    header: () => <div className="text-text-muted text-sm font-medium">Quantity</div>,
    cell: ({ row }) => (
      <Badge className="bg-bg-badge-default! border-border-default text-text-subtle rounded-md border text-xs font-medium">
        {row.original.quantity}
      </Badge>
    ),
    size: 120,
  },

  {
    accessorKey: "amount",
    header: () => <div className="text-text-muted text-sm font-medium">Amount</div>,
    cell: ({ row }) => <div className="text-text-default text-sm font-medium">₦{row.original.amount.toLocaleString()}</div>,
    size: 140,
  },

  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => <RenderOptions row={row} />,
    size: 60,
  },
];
