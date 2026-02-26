import { Staff } from "@/api/types";
import { Avatar } from "@/components/Avatar";
import Edit from "@/components/Icons/Edit";
import { UserForbid } from "@/components/Icons/UserForbid";
import { getStatusBadge, staffStatusBadge } from "@/components/Status";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatRelativeDate } from "@/lib/utils";
import { useStaffStore } from "@/store/staff";
import { ColumnDef, Row } from "@tanstack/react-table";
import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RenderOptions = (row: Row<Staff>) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { setOpenDeactivation, setStaffIdToDeactivate } = useStaffStore();
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger onClick={evt => evt.stopPropagation()} className="focus-visible:ring-0 focus-visible:outline-none">
        <MoreHorizontalIcon className="text-icon-default-muted size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-bg-card border-border-default text-text-default py-2.5 shadow-sm">
        <DropdownMenuItem
          onClick={evt => {
            evt.stopPropagation();
            router.push(`/settings/permissions/staff/${row.original.staffId}`);
          }}
          className="hover:bg-bg-state-ghost-hover! cursor-pointer gap-2.5 px-3"
        >
          <EyeIcon className="text-icon-default-subtle size-4" />
          <span>View staff</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/settings/permissions/edit-staff/${row.original.staffId}`)}
          className="hover:bg-bg-state-ghost-hover! cursor-pointer gap-2.5 px-3"
        >
          <Edit fill="var(--color-icon-default-subtle)" className="size-4" />
          <span>Edit staff</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="border-border-default bg-border-default" />

        <DropdownMenuItem
          onClick={() => {
            setOpenDeactivation(true);
            setStaffIdToDeactivate(row.original.staffId);
          }}
          className="cursor-pointer gap-2.5 px-3"
        >
          <UserForbid fill="var(--color-icon-destructive)" className="size-4" />
          <span className="text-icon-destructive">Deactivate staff</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const StaffColumns: ColumnDef<Staff>[] = [
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
    accessorKey: "staffName",
    header: () => <div className="text-text-muted text-sm font-medium">Staff Name</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-between gap-4 lg:pr-10">
        <div className="flex items-center gap-2">
          <Avatar className="size-5" url="" />
          <span className="text-text-default cursor-pointer pl-0 text-sm font-medium">{row.original.fullName}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: () => <div className="text-text-muted text-sm font-medium">Role</div>,
    cell: ({ row }) => <span className="">{row.original.roleName ? staffStatusBadge(row.original.roleName) : "--"}</span>,
    size: 150,
  },
  {
    accessorKey: "email",
    header: () => <div className="text-text-muted text-sm font-medium">Email</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-normal">{row.original.email}</span>,
    size: 150,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-text-muted text-sm font-medium">Status</div>,
    cell: ({ row }) => (
      <span className="text-text-muted cursor-pointer text-sm font-normal">{getStatusBadge(row.original.status ? "Active" : "Inactive")}</span>
    ),
    size: 32,
  },
  {
    accessorKey: "branch",
    header: () => <div className="text-text-muted text-sm font-medium">Branch</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-normal">{row.original.branchName}</span>,
    size: 150,
  },
  {
    accessorKey: "lastLogin",
    header: () => <div className="text-text-muted text-sm font-medium">Last Login</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-normal">{formatRelativeDate(row.original.lastLogin)}</span>,
    size: 32,
  },

  {
    id: "actions",
    header: () => <div className="text-text-muted cursor-pointer text-sm font-medium"></div>,
    cell: ({ row }) => RenderOptions(row),
    size: 11,
  },
];
