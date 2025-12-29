import { ColumnDef, Row } from "@tanstack/react-table";
import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { Bank } from "@/components/Icons/Bank";
import BankCard from "@/components/Icons/BankCard";
import { Cash } from "@/components/Icons/Cash";
import DeleteBin from "@/components/Icons/DeleteBin";
import Edit from "@/components/Icons/Edit";
import { Folder3 } from "@/components/Icons/Folder3";
import { getBadge } from "@/components/StudentProfile/StudentTable/StudentInvoiceTable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { invoiceBreakdownType, paymentHistoryType } from "./invoiceIdTypes";

import { useClassesStore } from "@/store/classes";
import { DeletePaymentModal, PaymentDetailsModal } from "./InvoiceIdModals";

const RenderOptions = (row: Row<paymentHistoryType>) => {
  console.log(row);
  const [open, setOpen] = useState(false);
  const { isPaymentDetailsOpen, setIsPaymentDetailsOpen, deletePayment, setDeletePayment } = useClassesStore();
  return (
    <>
      {isPaymentDetailsOpen && <PaymentDetailsModal />}
      {deletePayment && <DeletePaymentModal />}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger onClick={evt => evt.stopPropagation()} className="focus-visible:ring-0 focus-visible:outline-none">
          <MoreHorizontalIcon className="text-icon-default-muted size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-bg-card border-border-default text-text-default py-2.5 shadow-sm">
          <DropdownMenuItem className="gap-2.5 px-3" onClick={() => setIsPaymentDetailsOpen(true)}>
            <EyeIcon className="text-icon-default-subtle size-4" />
            <span>View payment</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2.5 px-3">
            <Edit fill="var(--color-icon-default-subtle)" className="size-4" />
            <span>Edit payment</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="border-border-default bg-border-default" />

          <DropdownMenuItem className="gap-2.5 px-3" onClick={() => setDeletePayment(true)}>
            <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
            <span className="text-icon-destructive">Delete payment</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const getPaymentMethodIcon = (method: string) => {
  switch (method) {
    case "Bank Transfer Terminal":
      return <Bank fill="var(--color-icon-default-muted)" />;

    case "Cash":
      return <Cash fill="var(--color-icon-default-muted)" />;

    case "Other Bank Transfer":
      return <Folder3 fill="var(--color-icon-default-muted)" />;

    case "POS":
      return <BankCard fill="var(--color-icon-default-muted)" />;

    default:
      return <Bank fill="var(--color-icon-default-muted)" />;
  }
};

export const breakdownColumns: ColumnDef<invoiceBreakdownType>[] = [
  {
    accessorKey: "invoiceId",
    header: () => <div className="text-text-muted text-sm font-medium">Invoice ID</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "quantity",
    header: () => <div className="text-text-muted text-sm font-medium">Quantity</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{row.original.quantity}</span>,
  },
  {
    accessorKey: "price",
    header: () => <div className="text-text-muted text-sm font-medium">Price</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">₦{row.original.price.toLocaleString()}</span>,
  },
  {
    accessorKey: "total",
    header: () => <div className="text-text-muted text-sm font-medium">Total</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">₦{row.original.total.toLocaleString()}</span>,
  },
  {
    accessorKey: "type",
    header: () => <div className="text-text-muted text-sm font-medium">Type</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{getBadge(row.original.status)}</span>,
    size: 22,
  },
];

export const paymentHistoryColumns: ColumnDef<paymentHistoryType>[] = [
  {
    accessorKey: "id",
  },
  {
    accessorKey: "date",
    header: () => <div className="text-text-muted text-sm font-medium">Date</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.date}</span>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-text-muted text-sm font-medium">Amount</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">₦{row.original.amount.toLocaleString()}</span>,
  },
  {
    accessorKey: "method",
    header: () => <div className="text-text-muted text-sm font-medium">Payment Method</div>,
    cell: ({ row }) => (
      <span className="text-text-muted flex cursor-pointer items-center gap-1 text-sm font-normal">
        {getPaymentMethodIcon(row.original.method)}
        {row.original.method}
      </span>
    ),
  },
  {
    accessorKey: "paidBy",
    header: () => <div className="text-text-muted text-sm font-medium">Paid By</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Avatar className="size-5" username={row.original.paidBy} />
        <span className="text-text-default cursor-pointer text-sm font-normal">{row.original.paidBy}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-text-muted text-sm font-medium">Status</div>,
    cell: ({ row }) => getBadge(row.original.status),
  },
  {
    accessorKey: "addedBy",
    header: () => <div className="text-text-muted text-sm font-medium">Added By</div>,
    cell: ({ row }) => (
      <>
        {row.original.addedBy === "System" ? (
          <span className="text-text-default text-sm font-normal">{row.original.addedBy}</span>
        ) : (
          <div className="flex items-center gap-1">
            <Avatar className="size-5" username={row.original.addedBy} />
            <span className="text-text-default text-sm font-normal">{row.original.paidBy}</span>
          </div>
        )}
      </>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-text-muted cursor-pointer text-sm font-medium"></div>,
    cell: ({ row }) => RenderOptions(row),
    size: 11,
  },
];
