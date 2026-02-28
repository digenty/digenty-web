import { Avatar } from "@/components/Avatar";
import { ScoreType } from "@/components/ScoreViewBySubject/types";
import { ColumnDef } from "@tanstack/react-table";

export const viewScoreColumns = (): ColumnDef<ScoreType>[] => [
  {
    accessorKey: "s/n",
    header: () => <div className="text-text-muted w-4 text-sm font-medium">S/N</div>,
    cell: ({ row }) => <span className="text-text-default h-14 w-4 cursor-pointer text-center text-sm font-normal">{row.index + 1}</span>,
    size: 50,
    maxSize: 50,
  },
  {
    accessorKey: "studentName",
    header: () => <div className="text-text-muted text-sm font-medium">Student Name</div>,
    cell: ({ row }) => (
      <div className="flex h-14 items-center justify-between gap-4 lg:pr-10">
        <div className="flex items-center gap-2">
          <Avatar className="size-8" url="" />
          <span className="text-text-default cursor-pointer pl-0 text-sm">{row.original.studentName}</span>
        </div>
      </div>
    ),
    size: 340,
  },
  {
    accessorKey: "CA1",
    header: () => <div className="text-text-muted text-center text-sm font-medium">CA 1</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer pl-0 text-sm">{row.original.CA1}</span>,
  },
  {
    accessorKey: "CA2",
    header: () => <div className="text-text-muted text-center text-sm font-medium">CA 2</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer pl-0 text-sm">{row.original.CA2}</span>,
  },
  {
    accessorKey: "examScore",
    header: () => <div className="text-text-muted text-center text-sm font-medium">Exam Score</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer pl-0 text-sm">{row.original.examScore}</span>,
  },

  {
    accessorKey: "totalScore",
    header: () => <div className="text-text-muted text-center text-sm font-medium">Total</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer pl-0 text-sm">{row.original.totalScore}</span>,
  },
  {
    accessorKey: "grade",
    header: () => <div className="text-text-muted text-center text-sm font-medium">Grade</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer pl-0 text-sm">{row.original.grade}</span>,
  },
  {
    accessorKey: "remark",
    header: () => <div className="text-text-muted text-center text-sm font-medium">Remark</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer pl-0 text-sm">{row.original.grade}</span>,
  },
];
