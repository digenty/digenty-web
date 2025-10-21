"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { PencilLineIcon } from "lucide-react";
import { Student } from "../DataTable/types";

export const columns: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label="Select row" />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: () => <div className="text-xs font-medium">Id</div>,
  },
  {
    accessorKey: "name",
    header: () => <div className="text-xs font-medium">Name</div>,
    cell: ({ row }) => <span className="cursor-pointer text-sm">{row.original.name}</span>,
  },
  {
    accessorKey: "gender",
    header: () => <div className="text-xs font-medium">Gender</div>,
    cell: ({ row }) => <span className="cursor-pointer text-sm">{row.original.gender}</span>,
  },
  {
    accessorKey: "class",
    header: () => <div className="text-xs font-medium">Class</div>,
    cell: ({ row }) => <span className="cursor-pointer text-sm">{row.original.class}</span>,
  },
  {
    accessorKey: "admissionNumber",
    header: () => <div className="text-xs font-medium">Admission Number</div>,
    cell: ({ row }) => <span className="cursor-pointer text-sm">{row.original.admissionNumber}</span>,
  },
  {
    accessorKey: "dob",
    header: () => <div className="text-xs font-medium">Date of Birth</div>,
    // cell: ({ row }) => <span className="cursor-pointer text-sm">{formatDate(row.original.dob)}</span>,
    cell: ({ row }) => <span className="cursor-pointer text-sm">{row.original.dob}</span>,
  },
  {
    accessorKey: "branch",
    header: () => <div className="text-xs font-medium">Branch</div>,
    cell: ({ row }) => <span className="cursor-pointer text-sm">{row.original.branch}</span>,
  },
  {
    id: "actions",
    header: () => <div className="cursor-pointer text-xs font-medium"></div>,
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
  },
];
