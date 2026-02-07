import { ColumnDef, Row } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { InvoicesOverviewTableProps } from "./types";
import { Avatar } from "../Avatar";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import Edit from "../Icons/Edit";
import DeleteBin from "../Icons/DeleteBin";
import { getBadge } from "../StudentProfile/StudentTable/StudentInvoiceTable";
import Notification2 from "../Icons/Notification2";
import { BallPen } from "../Icons/BallPen";
import { useRouter } from "next/navigation";

const RenderOptions = (row: Row<InvoicesOverviewTableProps>) => {
  const router = useRouter();
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
            router.push(`/invoices/${row.original.id}`);
          }}
          className="hover:bg-bg-state-ghost-hover cursor-pointer gap-2.5 px-3"
        >
          <EyeIcon className="text-icon-default-subtle size-4" />
          <span>View invoice</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/invoices/edit-invoice")} className="hover:bg-bg-state-ghost-hover gap-2.5 px-3">
          <Edit fill="var(--color-icon-default-subtle)" className="size-4" />
          <span>Edit invoice</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-bg-state-ghost-hover gap-2.5 px-3">
          <BallPen fill="var(--color-icon-default-subtle)" className="size-4" />
          <span>Record payment</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-bg-state-ghost-hover gap-2.5 px-3">
          <Notification2 fill="var(--color-icon-default-subtle)" className="size-4" />
          <span>Send reminder</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="border-border-default bg-border-default" />

        <DropdownMenuItem className="gap-2.5 px-3">
          <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
          <span className="text-icon-destructive">Delete invoice</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const InvoiceOverviewTableColumns: ColumnDef<InvoicesOverviewTableProps>[] = [
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
    id: "invoiceId",
    accessorKey: "id",
    header: () => <div className="text-text-muted text-sm font-medium">Invoice ID</div>,
    cell: ({ row }) => <div className="text-text-default text-sm font-medium">{row.original.id}</div>,
    size: 55,
  },
  {
    accessorKey: "studentName",
    header: () => <div className="text-text-muted text-sm font-medium">Student Name</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-between gap-4 lg:pr-10">
        <div className="flex items-center gap-2">
          <Avatar className="size-5" url="" />
          <span className="text-text-default cursor-pointer pl-0 text-sm font-medium">{row.original.studentName}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-text-muted text-sm font-medium">Amount</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">₦{row.original.amount.toLocaleString()}</span>,
    size: 150,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-text-muted text-sm font-medium">Status</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{getBadge(row.original.status)}</span>,
    size: 32,
  },
  {
    accessorKey: "lastActivity",
    header: () => <div className="text-text-muted text-sm font-medium">Last Activity</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{row.original.lastActivity}</span>,
    size: 32,
  },

  {
    id: "actions",
    header: () => <div className="text-text-muted cursor-pointer text-sm font-medium"></div>,
    cell: ({ row }) => RenderOptions(row),
    size: 11,
  },
];
