"use client";

import { AdmissionFeeType, AdmissionPaymentStatus, PaymentListItemDto } from "@/api/admission";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Download2 } from "@digenty/icons";

export const FEE_LABEL: Record<AdmissionFeeType, string> = {
  APPLICATION_FEE: "Application Fee",
  EXAMINATION_FEE: "Examination Fee",
  ENTRANCE_FEE: "Entrance Fee",
};

const statusStyles: Record<AdmissionPaymentStatus, { label: string; bg: string; text: string; icon?: React.ReactNode }> = {
  PAID: {
    label: "Paid",
    bg: "bg-badge-green",
    text: "text-bg-basic-green-strong",
    icon: <Check className="size-3" fill="var(--color-bg-basic-green-strong)" />,
  },
  OWING: {
    label: "Owing",
    bg: "bg-badge-red",
    text: "text-bg-basic-red-strong",
  },
};

export const PaymentStatusBadge = ({ status }: { status: AdmissionPaymentStatus }) => {
  const { bg, text, icon, label } = statusStyles[status];
  return (
    <Badge className={`border-border-default flex h-6 w-fit items-center gap-1 rounded-md border px-2 text-xs font-medium ${bg} ${text}`}>
      {icon}
      {label}
    </Badge>
  );
};

export const paymentColumns: ColumnDef<PaymentListItemDto>[] = [
  {
    accessorKey: "studentName",
    header: () => <div className="text-text-muted text-sm font-medium">Student Name</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="size-6 shrink-0" />
        <span className="text-text-default text-sm font-medium">{row.original.studentName}</span>
      </div>
    ),
    size: 200,
  },
  {
    accessorKey: "applicantNumber",
    header: () => <div className="text-text-muted text-sm font-medium">Applicant ID</div>,
    cell: ({ row }) => <span className="text-text-default text-sm">{row.original.applicantNumber}</span>,
    size: 140,
  },
  {
    accessorKey: "feeType",
    header: () => <div className="text-text-muted text-sm font-medium">Fee</div>,
    cell: ({ row }) => <span className="text-text-default text-sm">{FEE_LABEL[row.original.feeType]}</span>,
    size: 150,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-text-muted text-sm font-medium">Amount</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-medium">₦{row.original.amount.toLocaleString()}</span>,
    size: 110,
  },
  {
    accessorKey: "paymentStatus",
    header: () => <div className="text-text-muted text-sm font-medium">Payment Status</div>,
    cell: ({ row }) => <PaymentStatusBadge status={row.original.paymentStatus} />,
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
      <Button variant="ghost" className="size-7 p-0" onClick={e => e.stopPropagation()}>
        <Download2 fill="var(--color-icon-default-subtle)" className="size-4" />
      </Button>
    ),
    size: 50,
  },
];
