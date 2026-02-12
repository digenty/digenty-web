import { ColumnDef } from "@tanstack/react-table";
import { StockHistoryProps, StockQuantityManagementProps } from "./type";
import { stockStatus } from "@/components/Status";
import { ArrowUpDown } from "@/components/Icons/ArrowUpDown";
import { Avatar } from "@/components/Avatar";
import { ArrowRightUpFill } from "@/components/Icons/ArrowRightUpFill";

export const StocksQuantityManagementColumns: ColumnDef<StockQuantityManagementProps>[] = [
  {
    accessorKey: "location",
    header: () => <div className="text-text-muted text-sm font-medium">Location</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer pl-0 text-sm font-medium">{row.original.location}</span>,
    size: 300,
  },

  {
    accessorKey: "quantity",
    header: () => <div className="text-text-muted text-sm font-medium">Quantity</div>,
    cell: ({ row }) => <span className="text-text-muted text-sm font-medium">{row.original.quantity}</span>,
  },

  {
    accessorKey: "amount",
    header: () => <div className="text-text-muted text-sm font-medium">Amount</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.amount.toLocaleString()}</span>,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-text-muted text-sm font-medium">Status</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{stockStatus(row.original.status)}</span>,
    size: 32,
  },

  {
    id: "actions",
    header: () => <div className="text-text-muted cursor-pointer text-sm font-medium"></div>,
    cell: ({ row }) => (
      <div>
        {" "}
        <ArrowUpDown fill="var(--color-icon-default-muted)" />{" "}
      </div>
    ),
    size: 11,
  },
];

export const StocksHistoryColumns: ColumnDef<StockHistoryProps>[] = [
  {
    accessorKey: "date",
    header: () => <div className="text-text-muted text-sm font-medium">Date</div>,
    cell: ({ row }) => <span className="text-text-muted pl-0 text-sm font-normal">{row.original.date}</span>,
  },

  {
    accessorKey: "changedBy",
    header: () => <div className="text-text-muted text-sm font-medium">Change By</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="size-8" />
        <span className="text-text-default text-sm font-normal">{row.original.changedBy}</span>
      </div>
    ),
  },

  {
    accessorKey: "reason",
    header: () => <div className="text-text-muted text-sm font-medium">Reason</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.reason}</span>,
  },
  {
    accessorKey: "before",
    header: () => <div className="text-text-muted text-sm font-medium">Before</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-normal">{row.original.before}</span>,
    size: 32,
  },

  {
    accessorKey: "after",
    header: () => <div className="text-text-muted text-sm font-medium">After</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-normal">{row.original.after}</span>,
    size: 11,
  },
  {
    accessorKey: "change",
    header: () => <div className="text-text-muted text-sm font-medium">Change</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <ArrowRightUpFill fill="var(--color-icon-success)" />
        <span className="text-text-success cursor-pointer text-sm font-normal"> +{row.original.change}</span>,
      </div>
    ),
    size: 32,
  },
  {
    accessorKey: "branch",
    header: () => <div className="text-text-muted text-sm font-medium">Branch</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.branch}</span>,
  },
  {
    accessorKey: "summary",
    header: () => <div className="text-text-muted text-sm font-medium">Summary</div>,
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.reason}</span>
        <span className="text-text-informative cursor-pointer text-xs font-normal">{row.original.summary}</span>
      </div>
    ),
  },
];
