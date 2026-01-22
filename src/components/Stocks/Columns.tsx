import { ColumnDef, Row } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import Edit from "../Icons/Edit";
import DeleteBin from "../Icons/DeleteBin";
import { stocksItemsProps } from "./types";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { stockStatus } from "../Status";
import { FileCopy } from "../Icons/FileCopy";
import { ExpandUpAndDown } from "../Icons/ExpandUpAndDown";

const RenderOptions = (row: Row<stocksItemsProps>) => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger onClick={evt => evt.stopPropagation()} className="focus-visible:ring-0 focus-visible:outline-none">
        <MoreHorizontalIcon className="text-icon-default-muted size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-bg-card border-border-default text-text-default py-2.5 shadow-sm">
        <DropdownMenuItem
          onClick={evt => {
            evt.stopPropagation();
          }}
          className="hover:bg-bg-state-ghost-hover! cursor-pointer gap-2.5 px-3"
        >
          <EyeIcon className="text-icon-default-subtle size-4" />
          <span>View stock</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-bg-state-ghost-hover! gap-2.5 px-3">
          <Edit fill="var(--color-icon-default-subtle)" className="size-4" />
          <span>Edit stock</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-bg-state-ghost-hover! gap-2.5 px-3">
          <FileCopy fill="var(--color-icon-default-subtle)" className="size-4" />
          <span>Duplicate stock</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="border-border-default bg-border-default" />

        <DropdownMenuItem className="gap-2.5 px-3">
          <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
          <span className="text-icon-destructive">Delete stock</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const StocksOverviewTableColumns: ColumnDef<stocksItemsProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()}
          onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(value: boolean) => row.toggleSelected(!!value)} aria-label="Select row" />
      </div>
    ),
    size: 26,
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "itemName",
    header: () => <div className="text-text-muted text-sm font-medium">Item Name</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-between gap-4 lg:pr-10">
        <div className="flex items-center gap-2">
          <Image src="/images/image.png" alt="stock image" height={20} width={20} />
          <span className="text-text-default cursor-pointer pl-0 text-sm font-medium">{row.original.itemName}</span>
        </div>
      </div>
    ),
    size: 300,
  },

  {
    accessorKey: "category",
    header: () => <div></div>,
    cell: ({ row }) => (
      <Badge className="border-border-default bg-bg-badge-lime text-bg-basic-lime-strong w-fit rounded-md border text-xs font-medium">
        {row.original.category}
      </Badge>
    ),
  },

  {
    accessorKey: "quantity",
    header: () => <div className="text-text-muted text-sm font-medium">Quantity</div>,
    cell: ({ row }) => <span className="text-text-muted text-sm font-medium">{row.original.quantity}</span>,
  },

  {
    accessorKey: "amount",
    header: () => (
      <div className="text-text-muted flex items-center gap-2 text-sm font-medium">
        Amount <ExpandUpAndDown fill="var(--color-icon-default-muted)" />{" "}
      </div>
    ),
    cell: ({ row }) => (
      <span className="text-text-default cursor-pointer text-sm font-medium">
        {row.original.currency} {row.original.amount.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="text-text-muted flex items-center gap-2 text-sm font-medium">
        Status <ExpandUpAndDown fill="var(--color-icon-default-muted)" />
      </div>
    ),
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{stockStatus(row.original.status)}</span>,
    size: 32,
  },
  {
    accessorKey: "lastActivity",
    header: () => (
      <div className="text-text-muted flex items-center gap-2 text-sm font-medium">
        Last Activity <ExpandUpAndDown fill="var(--color-icon-default-muted)" />
      </div>
    ),
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{row.original.lastUpdated}</span>,
    size: 32,
  },

  {
    id: "actions",
    header: () => <div className="text-text-muted cursor-pointer text-sm font-medium"></div>,
    cell: ({ row }) => RenderOptions(row),
    size: 11,
  },
];
