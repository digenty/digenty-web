import { ArrowRightUpFill, ArrowUpDown, Subtract } from "@digenty/icons";
import { ColumnDef } from "@tanstack/react-table";

import { Avatar } from "@/components/Avatar";
import { stockStatus } from "@/components/Status";

import { ADJUST_REASON_LABELS } from "./constants";
import { StockBranchEntry, StockTransactionRecord } from "./type";

const formatDate = (raw?: string) => {
  if (!raw) return "-";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
};

const formatReason = (reason?: string) => {
  if (!reason) return "-";
  return ADJUST_REASON_LABELS[reason as keyof typeof ADJUST_REASON_LABELS] ?? reason;
};

export const StocksQuantityManagementColumns: ColumnDef<StockBranchEntry>[] = [
  {
    id: "location",
    header: () => <div className="text-text-muted text-sm font-medium">Location</div>,
    cell: ({ row }) => (
      <span className="text-text-default cursor-pointer pl-0 text-sm font-medium">
        {row.original.location ?? row.original.branchName ?? row.original.branch?.name ?? "-"}
      </span>
    ),
    size: 300,
  },
  {
    accessorKey: "quantity",
    header: () => <div className="text-text-muted text-sm font-medium">Quantity</div>,
    cell: ({ row }) => <span className="text-text-muted text-sm font-medium">{row.original.quantity ?? 0}</span>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-text-muted text-sm font-medium">Amount</div>,
    cell: ({ row }) => (
      <span className="text-text-default cursor-pointer text-sm font-medium">
        ₦ {Number(row.original.amount ?? row.original.price ?? 0).toLocaleString()}
      </span>
    ),
  },
  {
    id: "status",
    header: () => <div className="text-text-muted text-sm font-medium">Status</div>,
    cell: ({ row }) => {
      const s = row.original.status ?? row.original.stockStatus;
      const label = s ? s.toString().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "-";
      return <span className="text-text-muted cursor-pointer text-sm font-normal">{stockStatus(label)}</span>;
    },
    size: 32,
  },
  {
    id: "actions",
    header: () => <div></div>,
    cell: () => (
      <div>
        <ArrowUpDown fill="var(--color-icon-default-muted)" />
      </div>
    ),
    size: 11,
  },
];

export const StocksHistoryColumns: ColumnDef<StockTransactionRecord>[] = [
  {
    id: "date",
    header: () => <div className="text-text-muted text-sm font-medium">Date</div>,
    cell: ({ row }) => <span className="text-text-muted pl-0 text-sm font-normal">{formatDate(row.original.date ?? row.original.createdAt)}</span>,
  },
  {
    id: "changedBy",
    header: () => <div className="text-text-muted text-sm font-medium">Change By</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="size-8" />
        <span className="text-text-default text-sm font-normal">
          {row.original.changedBy ?? row.original.userName ?? row.original.user?.name ?? "-"}
        </span>
      </div>
    ),
  },
  {
    id: "reason",
    header: () => <div className="text-text-muted text-sm font-medium">Reason</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">{formatReason(row.original.reason)}</span>,
  },
  {
    id: "before",
    header: () => <div className="text-text-muted text-sm font-medium">Before</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-normal">{row.original.before ?? row.original.quantityBefore ?? 0}</span>,
    size: 32,
  },
  {
    id: "after",
    header: () => <div className="text-text-muted text-sm font-medium">After</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-normal">{row.original.after ?? row.original.quantityAfter ?? 0}</span>,
    size: 11,
  },
  {
    id: "change",
    header: () => <div className="text-text-muted text-sm font-medium">Change</div>,
    cell: ({ row }) => {
      const change = row.original.change ?? row.original.quantityAdjustment ?? 0;
      const isIncrease = row.original.type ? row.original.type === "INCREASE" : change >= 0;
      return (
        <div className="flex items-center gap-3">
          {isIncrease ? (
            <ArrowRightUpFill fill="var(--color-icon-success)" />
          ) : (
            <Subtract fill="var(--color-icon-destructive)" />
          )}
          <span className={`cursor-pointer text-sm font-normal ${isIncrease ? "text-text-success" : "text-text-destructive"}`}>
            {isIncrease ? "+" : ""}
            {change}
          </span>
        </div>
      );
    },
    size: 32,
  },
  {
    id: "branch",
    header: () => <div className="text-text-muted text-sm font-medium">Branch</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.branchName ?? row.original.branch ?? "-"}</span>,
  },
  {
    id: "summary",
    header: () => <div className="text-text-muted text-sm font-medium">Summary</div>,
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="text-text-default cursor-pointer text-sm font-medium">{formatReason(row.original.reason)}</span>
        {row.original.summary && <span className="text-text-informative cursor-pointer text-xs font-normal">{row.original.summary}</span>}
      </div>
    ),
  },
];
