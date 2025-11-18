"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Student } from "./AttendanceTable";
import { Avatar } from "@/components/Avatar";
import { CheckIcon, XIcon } from "lucide-react";

const RenderAttendance = (row: Row<Student>) => {
  return (
    <div className="flex cursor-pointer justify-center">
      <div className="border-border-default w-1/2 border-r">
        <CheckIcon className="text-icon-default-muted size-4.5 justify-self-center" />
      </div>
      <div className="w-1/2">
        <XIcon className="text-icon-default-muted size-4.5 justify-self-center" />
      </div>
    </div>
  );
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "s/n",
    header: () => <div className="text-text-muted inline-block w-1 text-sm font-medium">S/N</div>,
    cell: ({ row }) => <span className="text-text-default inline-block h-6 w-1 cursor-pointer text-sm">{row.index + 1}</span>,
    size: 20,
    maxSize: 20,
  },
  {
    accessorKey: "name",
    header: () => <div className="text-text-muted text-sm font-medium">Student Name</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <Avatar username="Damilare John" className="size-5" />
        <span className="text-text-default cursor-pointer text-sm">{row.original.name}</span>
      </div>
    ),
    size: 600,
  },
  {
    accessorKey: "attendance",
    header: () => <div className="text-text-muted text-sm font-medium">Attendance</div>,
    cell: ({ row }) => RenderAttendance(row),
  },
];
