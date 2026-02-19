"use client";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef, Row } from "@tanstack/react-table";
import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { AllBranchesTableProps } from "./types";
import Notification2 from "@/components/Icons/Notification2";
import { Key } from "@/components/Icons/Key";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/Avatar";

const RenderOptions = ({ row }: { row: Row<AllBranchesTableProps> }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger onClick={evt => evt.stopPropagation()} className="focus-visible:ring-0 focus-visible:outline-none">
        <MoreHorizontalIcon className="text-icon-default-muted size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-bg-card border-border-default text-text-default py-2.5 shadow-sm">
        <DropdownMenuItem className="hover:bg-bg-basic-gray-alpha-2! gap-2.5 px-3">
          <EyeIcon className="text-icon-default-subtle size-4" />
          <span>View branch</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-bg-basic-gray-alpha-2! gap-2.5 px-3">
          <Notification2 fill="var(--color-icon-default-subtle)" className="size-4" />
          <span>Notify branch head</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-bg-basic-gray-alpha-2! gap-2.5 px-3"
          onClick={() => router.push(`/classes-and-subjects/all-branches/${row.original.branchId}/manage-edits`)}
        >
          <Key fill="var(--color-icon-default-subtle)" className="size-4" />
          <span>Manage edit requests</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const AllBranchDetailsColumns: ColumnDef<AllBranchesTableProps>[] = [
  {
    accessorKey: "branchName",
    header: () => <div className="text-text-muted text-sm font-medium">Branch</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-medium">{row.original.branchName}</span>,
    size: 100,
  },
  {
    accessorKey: "BranchHeadName",
    header: () => <div className="text-text-muted text-sm font-medium">Branch Head</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar />
        <span className="text-text-default text-sm font-medium">{row.original.BranchHeadName}</span>
      </div>
    ),
    size: 100,
  },

  {
    accessorKey: "numberOfClassArm",
    header: () => <div className="text-text-muted text-sm font-medium">Classes</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-medium">{row.original.numberOfClassArm}</span>,
    size: 100,
  },

  {
    accessorKey: "numberOfClassTeacherSubmitted",
    header: () => <div className="text-text-muted text-sm font-medium">Class Teacher Submitted</div>,
    cell: ({ row }) => <div className="text-text-default text-sm font-medium">{row.original.numberOfClassTeacherSubmitted}</div>,
    size: 140,
  },
  {
    accessorKey: "numberOfPendingApprovals",
    header: () => <div className="text-text-muted text-sm font-medium">Pending Approvals</div>,
    cell: ({ row }) => <div className="text-text-default text-sm font-medium">{row.original.numberOfPendingApprovals}</div>,
    size: 140,
  },

  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => <RenderOptions row={row} />,
    size: 60,
  },
];
