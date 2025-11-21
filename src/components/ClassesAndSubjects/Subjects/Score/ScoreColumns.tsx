import { ColumnDef } from "@tanstack/react-table";

import { ScoreProps } from "./types";
import { Avatar } from "@/components/Avatar";

export const scoreColumns: ColumnDef<ScoreProps>[] = [
  {
    accessorKey: "s/n",
    header: () => <div className="text-text-muted text-sm w-0.5 font-medium">S/N</div>,
    cell: ({ row }) => <span className="text-text-default w-0.5 cursor-pointer h-14 text-center text-sm font-normal">{row.index + 1}</span>,
    size: 20,
    maxSize: 20,
  },
  {
    accessorKey: "studentName",
    header: () => <div className="text-text-muted text-sm font-medium">Student Name</div>,
    cell: ({ row }) => (
      <div className="flex items-center h-14 justify-between gap-4 lg:pr-10">
        <div className="flex items-center gap-2">
          <Avatar username={row.original.studentName} className="size-5" url="" />
          <span className="text-text-default cursor-pointer pl-0 text-sm font-medium">{row.original.studentName}</span>
        </div>
      </div>
    ),
    size: 340,
  },
  {
    accessorKey: "ca1Score",
    header: () => <div className="text-text-muted text-sm font-medium text-center">CA 1</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{row.original.ca1Score}</span>,
    size: 108,
  },
  {
    accessorKey: "ca2Score",
    header: () => <div className="text-text-muted text-sm font-medium text-center">CA 2</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{row.original.ca2Score}</span>,
    size: 150,
  },
  {
    accessorKey: "examScore",
    header: () => <div className="text-text-muted text-sm font-medium text-center">Exam Score</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{row.original.examScore}</span>,
    size: 108,
  },

  {
    accessorKey: "totalScore",
    header: () => <div className="text-text-muted text-sm font-medium text-center">Total</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{row.original.totalScore}</span>,
    size: 108,
  },
  {
    accessorKey: "grade",
    header: () => <div className="text-text-muted text-sm font-medium text-center">Grade</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{row.original.grade}</span>,
    size: 108,
  },
  {
    accessorKey: "remark",
    header: () => <div className="text-text-muted text-center text-sm font-medium">Remark</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer  text-sm font-normal">{row.original.remark}</span>,
    size: 108,
  },
];
