"use client";

import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Download2 from "@/components/Icons/Download2";
import { Check } from "@/components/Icons/Check";
import { ColumnDef } from "@tanstack/react-table";
import { PaymentRecord, PaymentStatus } from "./types";


const statusStyles: Record<PaymentStatus, { bg: string; text: string; icon?: React.ReactNode }> = {
  Paid: {
    bg: "bg-badge-green",
    text: "text-bg-basic-green-strong",
    icon: <Check className="size-3" fill="var(--color-bg-basic-green-strong)" />,
  },
  Pending: {
    bg: "bg-badge-orange",
    text: "text-bg-basic-orange-strong",
  },
  Overdue: {
    bg: "bg-badge-red",
    text: "text-bg-basic-red-strong",
  },
};

export const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
  const { bg, text, icon } = statusStyles[status];
  return (
    <Badge className={`border-border-default flex h-6 w-fit items-center gap-1 rounded-md border px-2 text-xs font-medium ${bg} ${text}`}>
      {icon}
      {status}
    </Badge>
  );
};


export const paymentColumns: ColumnDef<PaymentRecord>[] = [
  {
    accessorKey: "studentName",
    header: () => <div className="text-text-muted text-sm font-medium">Student Name</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="size-6 shrink-0" url={row.original.image} />
        <span className="text-text-default text-sm font-medium">{row.original.studentName}</span>
      </div>
    ),
    size: 200,
  },
  {
    accessorKey: "applicantId",
    header: () => <div className="text-text-muted text-sm font-medium">Applicant ID</div>,
    cell: ({ row }) => <span className="text-text-default text-sm">{row.original.applicantId}</span>,
    size: 140,
  },
  {
    accessorKey: "className",
    header: () => <div className="text-text-muted text-sm font-medium">Class</div>,
    cell: ({ row }) => <span className="text-text-default text-sm">{row.original.className}</span>,
    size: 120,
  },
  {
    accessorKey: "fee",
    header: () => <div className="text-text-muted text-sm font-medium">Fee</div>,
    cell: ({ row }) => <span className="text-text-default text-sm">{row.original.fee}</span>,
    size: 150,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-text-muted text-sm font-medium">Amount</div>,
    cell: ({ row }) => (
      <span className="text-text-default text-sm font-medium">
        ₦{row.original.amount.toLocaleString()}
      </span>
    ),
    size: 110,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-text-muted text-sm font-medium">Payment Status</div>,
    cell: ({ row }) => <PaymentStatusBadge status={row.original.status} />,
    size: 140,
  },
  {
    accessorKey: "date",
    header: () => <div className="text-text-muted text-sm font-medium">Date</div>,
    cell: ({ row }) => <span className="text-text-muted text-sm">{row.original.date}</span>,
    size: 130,
  },
  {
    id: "download",
    header: () => null,
    cell: () => (
      <Button
        variant="ghost"
        className="size-7 p-0"
        onClick={e => e.stopPropagation()}
      >
        <Download2 fill="var(--color-icon-default-subtle)" className="size-4" />
      </Button>
    ),
    size: 50,
  },
];
