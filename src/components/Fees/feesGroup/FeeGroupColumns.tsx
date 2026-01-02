"use client";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef, Row } from "@tanstack/react-table";
import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DeleteBin from "@/components/Icons/DeleteBin";
import { getStatusBadge } from "@/components/Status";
import { FeeGroupProp } from "./feeGroupType";
import Edit from "@/components/Icons/Edit";
import { FileCopy } from "@/components/Icons/FileCopy";

const RenderOptions = ({ row }: { row: Row<FeeGroupProp> }) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger onClick={evt => evt.stopPropagation()} className="focus-visible:ring-0 focus-visible:outline-none">
        <MoreHorizontalIcon className="text-icon-default-muted size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-bg-card border-border-default text-text-default py-2.5 shadow-sm">
        <DropdownMenuItem className="gap-2.5 px-3">
          <EyeIcon className="text-icon-default-subtle size-4" />
          <span>View fee group</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2.5 px-3">
          <Edit fill="var(--color-icon-default-subtle)" className="size-4" />
          <span>Edit fee group</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2.5 px-3">
          <FileCopy fill="var(--color-icon-default-subtle)" className="size-4" />
          <span>Duplicate fee group</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="border-border-default bg-border-default" />
        <DropdownMenuItem className="gap-2.5 px-3">
          <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
          <span className="text-icon-destructive">Delete class group</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const FeeGroupColumn: ColumnDef<FeeGroupProp>[] = [
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

  {
    accessorKey: "id",
    header: () => <div className="text-text-muted text-sm font-medium"></div>,
    cell: ({ row }) => <span className="text-text-default text-sm">{row.original.id}</span>,
  },

  {
    accessorKey: "feeGroupName",
    header: () => <div className="text-text-muted text-sm font-medium">Fee Group Name</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-medium">{row.original.classname}</span>,
    size: 100,
  },

  {
    accessorKey: "applyTo",
    header: () => <div className="text-text-muted text-sm font-medium">Fee</div>,
    cell: ({ row }) => {
      const item = row.original.applyTo;

      if (!item) return null;

      return (
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-bg-badge-default! border-border-default text-text-subtle rounded-md border text-xs font-medium">{item.item1}</Badge>
          <Badge className="bg-bg-badge-default! border-border-default text-text-subtle rounded-md border text-xs font-medium">{item.item2}</Badge>
          <Badge className="bg-bg-badge-default! border-border-default text-text-subtle rounded-md border text-xs font-medium">{item.item2}</Badge>
          <Badge className="bg-bg-badge-default! border-border-default text-text-subtle rounded-md border text-xs font-medium">+{item.count}</Badge>
        </div>
      );
    },
    size: 300,
  },

  {
    accessorKey: "totalAmount",
    header: () => <div className="text-text-muted text-sm font-medium">Total Amount</div>,
    cell: ({ row }) => <div className="text-text-default text-sm font-medium">₦{row.original.totalAmount.toLocaleString()}</div>,
    size: 140,
  },

  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => <RenderOptions row={row} />,
    size: 60,
  },
];
