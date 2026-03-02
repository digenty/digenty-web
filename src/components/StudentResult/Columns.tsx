import { ColumnDef } from "@tanstack/react-table";
import { Result } from ".";

export const columnsResult: ColumnDef<Result>[] = [
  {
    accessorKey: "subject",
    header: () => <div className="text-text-muted text-sm font-medium">Subject</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-normal">{row.original.subject}</span>,
    size: 150,
  },
  {
    accessorKey: "CA",
    header: () => <div className="text-text-muted text-sm font-medium">CA</div>,
    cell: ({ row }) => <span className="text-text-default text-center text-sm font-normal">{row.original.ca}</span>,
    size: 50,
  },
  {
    accessorKey: "exam",
    header: () => <div className="text-text-muted text-sm font-medium">Exam</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-normal">{row.original.exam}</span>,
    size: 50,
  },
  {
    accessorKey: "total",
    header: () => <div className="text-text-muted text-sm font-medium">Total</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-normal">{row.original.total}</span>,
    size: 50,
  },
  {
    accessorKey: "grade",
    header: () => <div className="text-text-muted text-sm font-medium">Grade</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-normal">{row.original.grade}</span>,
    size: 50,
  },
  {
    accessorKey: "remark",
    header: () => <div className="text-text-muted text-sm font-medium">Remark</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-normal">{row.original.remark}</span>,
    size: 200,
  },
];
