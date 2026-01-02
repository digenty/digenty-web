"use client";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef, Row } from "@tanstack/react-table";
import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { ClassFeeTypes } from "./classTypes";
import { Badge } from "@/components/ui/badge";
import DeleteBin from "@/components/Icons/DeleteBin";

const RenderOptions = ({ row }: { row: Row<ClassFeeTypes> }) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger onClick={evt => evt.stopPropagation()} className="focus-visible:ring-0 focus-visible:outline-none">
        <MoreHorizontalIcon className="text-icon-default-muted size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-bg-card border-border-default text-text-default py-2.5 shadow-sm">
        <DropdownMenuItem className="gap-2.5 px-3">
          <EyeIcon className="text-icon-default-subtle size-4" />
          <span>View class fee</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="border-border-default bg-border-default" />
        <DropdownMenuItem className="gap-2.5 px-3">
          <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
          <span className="text-icon-destructive">Delete class fee</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columnsClassFees: ColumnDef<ClassFeeTypes>[] = [
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
    header: () => <div className="text-text-muted text-sm font-medium">ID</div>,
    cell: ({ row }) => <span className="text-text-default text-sm">{row.original.id}</span>,
  },

  {
    accessorKey: "classname",
    header: () => <div className="text-text-muted text-sm font-medium">Class</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-medium">{row.original.classname}</span>,
    size: 100,
  },

  {
    accessorKey: "fee",
    header: () => <div className="text-text-muted text-sm font-medium">Fees</div>,
    cell: ({ row }) => {
      const fee = row.original.fee;

      if (!fee) return null;

      return (
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-bg-badge-default! border-border-default text-text-subtle rounded-md border text-xs font-medium">{fee.tution}</Badge>
          <Badge className="bg-bg-badge-default! border-border-default text-text-subtle rounded-md border text-xs font-medium">{fee.item}</Badge>
          <Badge className="bg-bg-badge-default! border-border-default text-text-subtle rounded-md border text-xs font-medium">{fee.item}</Badge>
          <Badge className="bg-bg-badge-default! border-border-default text-text-subtle rounded-md border text-xs font-medium">+{fee.count}</Badge>
        </div>
      );
    },
    size: 300,
  },

  {
    accessorKey: "totalAmount",
    header: () => <div className="text-text-muted text-sm font-medium">TotalAmount</div>,
    cell: ({ row }) => <div className="text-text-default text-sm font-medium">{row.original.totalAmount}</div>,
    size: 140,
  },

  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => <RenderOptions row={row} />,
    size: 60,
  },
];
