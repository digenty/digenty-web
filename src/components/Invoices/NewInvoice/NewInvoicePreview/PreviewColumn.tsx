import { ColumnDef } from "@tanstack/react-table";
import { PreviewProps } from "./PreviewTable";
import { getBadge } from "@/components/StudentProfile/StudentTable/StudentInvoiceTable";

export const previewColumns: ColumnDef<PreviewProps>[] = [
  {
    accessorKey: "id",
  },
  {
    accessorKey: "item",
    header: () => <div className="text-text-muted text-sm font-medium">Items</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{row.original.item}</span>,
    size: 20,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-text-muted text-sm font-medium"></div>,
    cell: ({ row }) => <div className="ml-[-15]">{getBadge(row.original.status)}</div>,
  },
  {
    accessorKey: "qty",
    header: () => <div className="text-text-muted text-sm font-medium">Qty</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-normal">{row.original.qty}</span>,
    size: 60,
  },
  {
    accessorKey: "price",
    header: () => <div className="text-text-muted text-sm font-medium">Unit Price</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-normal">₦{row.original.price.toLocaleString()}</span>,
    size: 72,
  },
  {
    accessorKey: "total",
    header: () => <div className="text-text-muted text-sm font-medium">Total</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">₦{row.original.total.toLocaleString()}</span>,
    size: 75,
  },
];
