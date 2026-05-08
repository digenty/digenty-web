import { DeleteBin, Edit, ExpandUpAndDown } from "@digenty/icons";
import { ColumnDef, Row } from "@tanstack/react-table";
import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { Avatar } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { stockStatus } from "../Status";
import { StockListItem } from "./types";

const STATUS_LABELS: Record<string, string> = {
  IN_STOCK: "In Stock",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
};

const RenderOptions = ({
  row,
  onView,
  onEdit,
  onDelete,
}: {
  row: Row<StockListItem>;
  onView?: (row: Row<StockListItem>) => void;
  onEdit?: (row: Row<StockListItem>) => void;
  onDelete?: (row: Row<StockListItem>) => void;
}) => {
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
            onView?.(row);
          }}
          className="hover:bg-bg-state-ghost-hover! cursor-pointer gap-2.5 px-3"
        >
          <EyeIcon className="text-icon-default-subtle size-4" />
          <span>View stock</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={evt => {
            evt.stopPropagation();
            onEdit?.(row);
          }}
          className="hover:bg-bg-state-ghost-hover! gap-2.5 px-3"
        >
          <Edit fill="var(--color-icon-default-subtle)" className="size-4" />
          <span>Edit stock</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="border-border-default bg-border-default" />

        <DropdownMenuItem
          onClick={evt => {
            evt.stopPropagation();
            onDelete?.(row);
          }}
          className="gap-2.5 px-3"
        >
          <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
          <span className="text-icon-destructive">Delete stock</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const buildStocksOverviewTableColumns = ({
  onView,
  onEdit,
  onDelete,
}: {
  onView?: (row: Row<StockListItem>) => void;
  onEdit?: (row: Row<StockListItem>) => void;
  onDelete?: (row: Row<StockListItem>) => void;
}): ColumnDef<StockListItem>[] => [
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
          <Avatar className="size-5" />
          <span className="text-text-default cursor-pointer pl-0 text-sm font-medium">{row.original.itemName}</span>
        </div>
      </div>
    ),
    size: 300,
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
        Amount <ExpandUpAndDown fill="var(--color-icon-default-muted)" />
      </div>
    ),
    cell: ({ row }) => (
      <span className="text-text-default cursor-pointer text-sm font-medium">₦ {Number(row.original.amount ?? 0).toLocaleString()}</span>
    ),
  },
  {
    accessorKey: "stockStatus",
    header: () => (
      <div className="text-text-muted flex items-center gap-2 text-sm font-medium">
        Status <ExpandUpAndDown fill="var(--color-icon-default-muted)" />
      </div>
    ),
    cell: ({ row }) => <span>{stockStatus(STATUS_LABELS[row.original.stockStatus] ?? row.original.stockStatus)}</span>,
    size: 32,
  },

  {
    id: "actions",
    header: () => <div></div>,
    cell: ({ row }) => <RenderOptions row={row} onView={onView} onEdit={onEdit} onDelete={onDelete} />,
    size: 11,
  },
];

export const STATUS_DISPLAY = STATUS_LABELS;

export const StockCategoryBadge = ({ name }: { name?: string | null }) =>
  name ? (
    <Badge className="border-border-default bg-bg-badge-lime text-bg-basic-lime-strong w-fit rounded-md border text-xs font-medium">{name}</Badge>
  ) : null;
