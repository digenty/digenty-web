"use client";

import { Parent } from "@/api/types";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useParentStore } from "@/store/useParentStore";
import { ColumnDef, Row } from "@tanstack/react-table";
import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar } from "../../Avatar";
import DeleteBin from "../../Icons/DeleteBin";
import Edit from "../../Icons/Edit";
import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { canManageStudentParentRecords } from "@/lib/permissions/students-and-parents";

const RenderOptions = (row: Row<Parent>) => {
  const router = useRouter();
  const { setOpenDelete, setParentIds } = useParentStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-0 focus-visible:outline-none">
        <MoreHorizontalIcon className="text-icon-default-muted size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-bg-card border-border-default text-text-default py-2.5 shadow-sm">
        <DropdownMenuItem onClick={() => router.push(`/student-and-parent-record/parents/${row.original.id}`)} className="gap-2.5 px-3">
          <EyeIcon className="text-icon-default-subtle size-4" />
          <span>View parent profile</span>
        </DropdownMenuItem>

        <PermissionCheck permissionUtility={canManageStudentParentRecords}>
          <DropdownMenuItem onClick={() => router.push(`/student-and-parent-record/parents/${row.original.id}/edit`)} className="gap-2.5 px-3">
            <Edit fill="var(--color-icon-default-subtle)" className="size-4" />
            <span>Edit parent profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="border-border-default bg-border-default" />

          <DropdownMenuItem
            onClick={() => {
              setOpenDelete(true);
              setParentIds([row.original.id]);
            }}
            className="gap-2.5 px-3"
          >
            <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
            <span className="text-icon-destructive">Delete parent profile</span>
          </DropdownMenuItem>
        </PermissionCheck>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const parentColumns: ColumnDef<Parent>[] = [
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
    size: 100,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: () => <div className="text-text-muted text-sm font-medium">Id</div>,
  },
  {
    accessorKey: "name",
    header: () => <div className="text-text-muted text-sm font-medium">Name</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-between gap-4 lg:pr-10">
        <div className="flex items-center gap-2">
          <Avatar className="size-5" url="" />
          <span className="text-text-default cursor-pointer pl-0 text-sm font-medium">
            {row.original.firstName} {row.original.lastName}
          </span>
        </div>

        {/* {row.original.tags && (
          <div className="flex items-center gap-2">
            {row.original.tags.map(tag => (
              <span
                className={cn("bg-bg-badge-fuchsia text-bg-basic-fuchsia-strong border-border-default rounded-lg border px-2 py-0.5 text-xs")}
                key={tag.label}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )} */}
      </div>
    ),
    size: 600,
  },
  {
    accessorKey: "gender",
    header: () => <div className="text-text-muted text-sm font-medium">Gender</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal capitalize">{row.original.gender.toLowerCase()}</span>,
    size: 150,
  },
  {
    accessorKey: "phoneNumber",
    header: () => <div className="text-text-muted text-sm font-medium">Phone Number</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-normal">{row.original.phoneNumber}</span>,
    size: 150,
  },
  {
    accessorKey: "emailAddress",
    header: () => <div className="text-text-muted text-sm font-medium">Email Address</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{row.original.email}</span>,
    size: 150,
  },

  {
    accessorKey: "branch",
    header: () => <div className="text-text-muted text-sm font-medium">Branch</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{row.original.branchId}</span>,
    size: 150,
  },
  {
    id: "actions",
    header: () => <div className="text-text-muted cursor-pointer text-sm font-medium"></div>,
    cell: ({ row }) => RenderOptions(row),
    // size: 150,
  },
];
