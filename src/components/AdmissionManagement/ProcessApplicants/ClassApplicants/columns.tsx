"use client";

import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontalIcon, X } from "lucide-react";
import { useState } from "react";
import { Applicant, AdmissionStatus } from "./types";
import { Check } from "@/components/Icons/Check";
import { Progress4 } from "@/components/Icons/Progress4";

const statusStyles: Record<AdmissionStatus, { bg: string; text: string; icon?: React.ReactNode }> = {
  Pending: {
    bg: "bg-badge-orange",
    text: "text-bg-basic-orange-strong",
    icon: <Progress4 className="size-3" fill="var(--color-bg-basic-orange-strong)" />,
  },
  Admitted: {
    bg: "bg-badge-green",
    text: "text-bg-basic-green-strong",
    icon: <Check className="size-3" fill="var(--color-bg-basic-green-strong)" />,
  },
  Rejected: {
    bg: "bg-badge-red",
    text: "text-bg-basic-red-strong",
    icon: <X className="size-3" fill="var(--color-bg-basic-red-strong)" />,
  },
};

export const StatusBadge = ({ status }: { status: AdmissionStatus }) => {
  const { bg, text, icon } = statusStyles[status];
  return (
    <Badge className={`border-border-default flex h-6 w-fit items-center gap-1 rounded-md border px-2 text-xs font-medium ${bg} ${text}`}>
      {icon}
      {status}
    </Badge>
  );
};

const RenderActions = ({ row, onView }: { row: Row<Applicant>; onView: (applicant: Applicant) => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <MoreHorizontalIcon
      onClick={e => {
        e.stopPropagation();
        onView(row.original);
        setOpen(false);
      }}
      className="text-icon-default-muted size-4 cursor-pointer"
    />
  );
};

export const createApplicantColumns = (onView: (applicant: Applicant) => void): ColumnDef<Applicant>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} />,
    size: 40,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: () => <div className="text-text-muted text-sm font-medium">Student Name</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="size-6 shrink-0" url={row.original.image} />
        <span className="text-text-default text-sm font-medium">{row.original.name}</span>
      </div>
    ),
    size: 220,
  },
  {
    accessorKey: "applicantId",
    header: () => <div className="text-text-muted text-sm font-medium">Applicant ID</div>,
    cell: ({ row }) => <span className="text-text-default text-sm">{row.original.applicantId}</span>,
    size: 160,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-text-muted text-sm font-medium">Admission Status</div>,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    size: 180,
  },
  {
    accessorKey: "totalScore",
    header: () => <div className="text-text-muted text-sm font-medium">Total Score</div>,
    cell: ({ row }) => <span className="text-text-default text-sm">{row.original.totalScore !== null ? row.original.totalScore : "-"}</span>,
    size: 120,
  },
  {
    accessorKey: "dateApplied",
    header: () => <div className="text-text-muted text-sm font-medium">Date Applied</div>,
    cell: ({ row }) => <span className="text-text-muted text-sm">{row.original.dateApplied}</span>,
    size: 160,
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => <RenderActions row={row} onView={onView} />,
    size: 50,
  },
];
