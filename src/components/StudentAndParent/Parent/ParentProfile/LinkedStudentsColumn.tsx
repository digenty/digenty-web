"use client";

import { Student } from "@/api/types";
import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const RenderOptions = (row: Row<{ id: number; fullName: string; avatar: string | null }>) => {
  const router = useRouter();
  return (
    <Button
      onClick={evt => {
        evt.stopPropagation();
        router.push(`/staff/student-and-parent-record/students/${row.original.id}`);
      }}
      className="bg-bg-state-secondary border-border-darker text-text-default h-6 border text-xs font-medium"
    >
      <EyeIcon className="text-icon-default-muted size-4" />
      <span>View Profile</span>
    </Button>
  );
};

export const columns: ColumnDef<{ id: number; fullName: string; avatar: string | null }>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-text-muted text-sm font-medium">Name</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.fullName}</span>,
    size: 500,
  },
  {
    accessorKey: "class",
    header: () => <div className="text-text-muted text-sm font-medium">Class</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">--</span>,
  },
  {
    accessorKey: "outstandingFee",
    header: () => <div className="text-text-muted text-sm font-medium">Outstanding Fee</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-normal">--</span>,
  },
  {
    accessorKey: "branch",
    header: () => <div className="text-text-muted text-sm font-medium">Branch</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">--</span>,
  },
  {
    id: "actions",
    header: () => <div />,
    cell: ({ row }) => RenderOptions(row),
  },
];
