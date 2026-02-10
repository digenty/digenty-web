"use client";

import { Student } from "@/api/types";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useStudentStore } from "@/store/student";
import { ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowRightIcon, CheckIcon, ChevronsUpDownIcon, EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "../../Avatar";
import DeleteBin from "../../Icons/DeleteBin";
import Edit from "../../Icons/Edit";
import UserMinus from "../../Icons/UserMinus";

const RenderOptions = (row: Row<Student>) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const { setOpenWithdraw, setOpenDelete, setStudentIdsToDelete, setStudentIdsToWithdraw } = useStudentStore();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger onClick={evt => evt.stopPropagation()} className="focus-visible:ring-0 focus-visible:outline-none">
        <MoreHorizontalIcon className="text-icon-default-muted size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-bg-card border-border-default text-text-default py-2.5 shadow-sm">
        <DropdownMenuItem onClick={() => router.push(`/student-and-parent-record/students/${row.original.id}`)} className="gap-2.5 px-3">
          <EyeIcon className="text-icon-default-subtle size-4" />
          <span>View student profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={evt => {
            evt.stopPropagation();
            router.push(`/student-and-parent-record/students/${row.original.id}/edit`);
          }}
          className="gap-2.5 px-3"
        >
          <Edit fill="var(--color-icon-default-subtle)" className="size-4" />
          <span>Edit student profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="border-border-default bg-border-default" />
        <DropdownMenuItem
          onClick={() => {
            setOpenWithdraw(true);
            setStudentIdsToWithdraw([row.original.id]);
          }}
          className="gap-2.5 px-3"
        >
          <UserMinus fill="var(--color-icon-default-subtle)" className="size-4" />
          <span>Withdraw student</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setOpenDelete(true);
            setStudentIdsToDelete([row.original.id]);
          }}
          className="gap-2.5 px-3"
        >
          <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
          <span className="text-icon-destructive">Delete student profile</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const filters = [{ value: "descending" }, { value: "ascending" }];

const RenderDOBHeader = () => {
  const [activeFilter, setActiveFilter] = useState("descending");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex cursor-pointer items-center gap-1.5 focus-visible:ring-0 focus-visible:outline-none">
        <span className="text-text-muted text-sm font-medium">Date of Birth</span>
        <ChevronsUpDownIcon className="text-icon-default-muted size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-bg-card border-border-default text-text-default px-3 py-2.5 shadow-sm">
        {filters.map((filter, index) => (
          <DropdownMenuItem
            key={index}
            className={cn("gap-2 px-0", activeFilter === filter.value ? "font-medium" : "font-normal")}
            onClick={() => setActiveFilter(filter.value)}
          >
            <div className="w-1/4">{activeFilter === filter.value && <CheckIcon className="text-icon-default-subtle size-4" />}</div>

            <div className="flex flex-1 items-center gap-1">
              <span>{filter.value === "descending" ? "Oldest" : "Youngest"}</span>
              <ArrowRightIcon className={"text-text-default"} />
              <span>{filter.value === "descending" ? "Youngest" : "Oldest"}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Student>[] = [
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
          <Avatar className="size-5" url={row.original.image ?? ""} />
          <span className="text-text-default cursor-pointer pl-0 text-sm font-medium">
            {row.original.firstName} {row.original.lastName}
          </span>
        </div>

        {row.original.tags.length > 0 && row.original.tags && (
          <div className="flex items-center gap-2">
            {row.original.tags.slice(0, 3).map((tag, index) => (
              <div key={`${tag}-${index}`}>
                {tag && (
                  <span
                    className={cn("bg-bg-badge-cyan text-bg-basic-cyan-strong border-border-default rounded-lg border px-2 py-0.5 text-xs")}
                    key={tag}
                  >
                    {tag}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
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
    accessorKey: "class",
    header: () => <div className="text-text-muted text-sm font-medium">Class</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-normal">{row.original.class}</span>,
    size: 150,
  },
  {
    accessorKey: "admissionNumber",
    header: () => <div className="text-text-muted text-sm font-medium">Admission Number</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{row.original.admissionNumber}</span>,
    size: 150,
  },
  {
    accessorKey: "dob",
    header: () => RenderDOBHeader(),
    // cell: ({ row }) => <span className="cursor-pointer text-sm font-normal text-text-muted">{formatDate(row.original.dob)}</span>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{format(row.original.dateOfBirth, "P")}</span>,
    size: 150,
  },
  {
    accessorKey: "branch",
    header: () => <div className="text-text-muted text-sm font-medium">Branch</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{row.original.branch}</span>,
    size: 150,
  },
  {
    id: "actions",
    header: () => <div className="text-text-muted cursor-pointer text-sm font-medium"></div>,
    cell: ({ row }) => RenderOptions(row),
    // size: 150,
  },
];
