import { ColumnDef } from "@tanstack/react-table";
import { ClassReportProps } from "../types";
import { Avatar } from "@/components/Avatar";

export const ClassReportColumns: ColumnDef<ClassReportProps>[] = [
  {
    accessorKey: "s/n",
    header: () => <div className="text-text-muted w-0.5 text-sm font-medium">S/N</div>,
    cell: ({ row }) => <span className="text-text-default h-14 w-0.5 cursor-pointer text-center text-sm font-normal">{row.index + 1}</span>,
    size: 20,
    maxSize: 20,
  },
  {
    accessorKey: "studentName",
    header: () => <div className="text-text-muted text-sm font-medium">Teacher</div>,
    cell: ({ row }) => (
      <div className="items center flex gap-2">
        <Avatar className="size-5" />
        <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.studentName}</span>{" "}
      </div>
    ),
    size: 252,
  },
  {
    accessorKey: "subject",
    header: () => <div className="text-text-muted text-center text-sm font-medium">Subject</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.subject}</span>,
  },
  {
    accessorKey: "subject",
    header: () => <div className="text-text-muted text-center text-sm font-medium">Subject</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.subject}</span>,
  },
  {
    accessorKey: "subject",
    header: () => <div className="text-text-muted text-center text-sm font-medium">Subject</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.subject}</span>,
  },
  {
    accessorKey: "subject",
    header: () => <div className="text-text-muted text-center text-sm font-medium">Subject</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.subject}</span>,
  },
  {
    accessorKey: "subject",
    header: () => <div className="text-text-muted text-center text-sm font-medium">Subject</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.subject}</span>,
  },
  {
    accessorKey: "subject",
    header: () => <div className="text-text-muted text-center text-sm font-medium">Subject</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.subject}</span>,
  },
];
