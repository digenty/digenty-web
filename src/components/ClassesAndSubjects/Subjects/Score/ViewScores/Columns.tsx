import { ColumnDef, Row } from "@tanstack/react-table";
import { StudentResult } from ".";
import { Avatar } from "@/components/Avatar";

export const viewScoreColumns = (headers: string[]): ColumnDef<StudentResult>[] => [
  {
    accessorKey: "s/n",
    header: () => <div className="text-text-muted inline-block text-sm font-medium">S/N</div>,
    cell: ({ row }) => <span className="text-text-default inline-block h-6 cursor-pointer text-sm">{row.index + 1}</span>,
    size: 20,
    maxSize: 200,
  },
  {
    accessorKey: "studentName",
    header: () => <div className="text-text-muted flex justify-start text-xs font-medium md:text-sm">Student Name</div>,
    cell: ({ row }: { row: Row<StudentResult> }) => (
      <div className="flex items-center gap-2">
        <Avatar className="size-8" />
        <span className="text-text-default flex cursor-pointer justify-start pl-0 text-xs md:text-sm">{row.original.studentName}</span>
      </div>
    ),
    size: 340,
  },

  ...headers.map(column => ({
    id: String(column),
    accessorFn: (row: StudentResult) => row[column],
    header: () => <div className="text-text-muted flex justify-center text-center text-xs font-medium md:text-sm">{column}</div>,
    cell: ({ row }: { row: Row<StudentResult> }) => (
      <span className="text-text-default flex justify-center text-xs font-normal md:text-sm">{row.original[column]}</span>
    ),
    size: 200,
  })),
  {
    accessorKey: "total",
    header: () => <div className="text-text-muted flex justify-center text-xs font-medium md:text-sm">Total</div>,
    cell: ({ row }: { row: Row<StudentResult> }) => (
      <span className="text-text-default flex cursor-pointer justify-center pl-0 text-xs md:text-sm">{row.original.total}</span>
    ),
    size: 340,
  },
  {
    accessorKey: "grade",
    header: () => <div className="text-text-muted flex justify-center text-xs font-medium md:text-sm">Grade</div>,
    cell: ({ row }: { row: Row<StudentResult> }) => (
      <span className="text-text-default flex cursor-pointer justify-center pl-0 text-xs md:text-sm">{row.original.grade || "-"}</span>
    ),
    size: 340,
  },
  {
    accessorKey: "remark",
    header: () => <div className="text-text-muted flex justify-center text-xs font-medium md:text-sm">Remark</div>,
    cell: ({ row }: { row: Row<StudentResult> }) => (
      <span className="text-text-default flex cursor-pointer justify-center pl-0 text-xs md:text-sm">{row.original.remark || "-"}</span>
    ),
    size: 340,
  },
];
