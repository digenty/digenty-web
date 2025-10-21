"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { PencilLineIcon } from "lucide-react";
import { Student } from "../DataTable/types";
import { Avatar } from "../Avatar";
import { cn } from "@/lib/utils";

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
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Avatar username="Damilare John" className="size-5" url="" />
          <span className="text-text-default cursor-pointer pl-0 text-sm font-medium">{row.original.name}</span>
        </div>

        {row.original.tags && (
          <div className="flex items-center gap-2">
            {row.original.tags.map(tag => (
              <span
                className={cn("bg-bg-badge-cyan text-bg-basic-cyan-strong border-border-default rounded-lg border px-2 py-0.5 text-xs")}
                key={tag.label}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>
    ),
    size: 900,
  },
  {
    accessorKey: "gender",
    header: () => <div className="text-text-muted text-sm font-medium">Gender</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{row.original.gender}</span>,
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
    header: () => <div className="text-text-muted text-sm font-medium">Date of Birth</div>,
    // cell: ({ row }) => <span className="cursor-pointer text-sm font-normal text-text-muted">{formatDate(row.original.dob)}</span>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{row.original.dob}</span>,
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
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          {/* <Link href={`admin?tab=roles-and-permissions&action=edit&id=${row.original.id}`} className="cursor-pointer focus-visible:ring-0">
            <span className="sr-only">Edit</span> */}
          <PencilLineIcon className="text-white-faded size-4" />
          {/* </Link> */}

          {/* <RenderDelete row={row} /> */}
        </div>
      );
    },
    size: 150,
  },
];
