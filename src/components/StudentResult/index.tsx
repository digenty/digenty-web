import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../DataTable";
import { useState } from "react";

type Result = {
  subject: string;
  ca: number;
  exam: number;
  total: number;
  grade: number;
  remark: string;
};

const result = [
  {
    subject: "English Language",
    ca: 50,
    exam: 50,
    total: 100,
    grade: 0,
    remark: "Poor",
  },
  {
    subject: "Mathematics",
    ca: 50,
    exam: 50,
    total: 100,
    grade: 0,
    remark: "Poor",
  },
  {
    subject: "Biology",
    ca: 50,
    exam: 50,
    total: 100,
    grade: 0,
    remark: "Poor",
  },
  {
    subject: "Human Anatomy and Physiology",
    ca: 50,
    exam: 50,
    total: 100,
    grade: 0,
    remark: "Poor",
  },
];

export const columns: ColumnDef<Result>[] = [
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

export const StudentResult = () => {
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<Result[]>([]);
  console.log(selectedRows);

  return (
    <div className="border-t-bg-basic-cyan-contrast border-x-border-default border-b-border-default border-x border-t-2 border-b">
      <div className="flex flex-col items-center justify-center py-3">
        <h1 className="text-bg-basic-cyan-contrast text-xl font-semibold">Digenty Technology School</h1>
        <p className="text-text-muted text-sm font-normal">2nd Term 2024/2025 Session</p>
      </div>

      <div className="border-border-default text-text-default flex justify-between border-y px-4 py-2.5 text-sm font-normal">
        <span>
          Name: <span className="font-medium">Damilare John</span>
        </span>
        <span>
          Class: <span className="font-medium">SS 1 Arts A</span>
        </span>
      </div>

      <div className="flex gap-6 px-4 py-5">
        <div className="w-1/2 space-y-2">
          <h3 className="text-bg-basic-red-accent text-sm font-semibold">ATTENDANCE</h3>

          <div className="text-text-subtle border-border-default border text-xs font-medium md:text-sm">
            <div className="border-border-default flex justify-between border-b px-2">
              <div className="line-clamp-1 w-3/4 flex-1 truncate py-2">
                <span className="hidden lg:inline">No. of Times </span>
                <span>School Opened:</span>
              </div>
              <div className="border-border-default w-1/4 border-l py-2 pl-2 text-center">130</div>
            </div>

            <div className="border-border-default flex justify-between border-b px-2">
              <div className="line-clamp-1 w-3/4 flex-1 truncate py-2">
                <span className="hidden lg:inline">No. of </span>
                <span>Times Present:</span>
              </div>
              <div className="border-border-default w-1/4 border-l py-2 pl-2 text-center">130</div>
            </div>

            <div className="flex justify-between px-2">
              <div className="line-clamp-1 w-3/4 flex-1 truncate py-2">
                <span className="hidden lg:inline">No. of </span>
                <span>Times Absent:</span>
              </div>
              <div className="border-border-default w-1/4 border-l py-2 pl-2 text-center">13</div>
            </div>
          </div>
        </div>

        <div className="w-1/2 space-y-2">
          <h3 className="text-bg-basic-red-accent text-xs font-semibold md:text-sm">CONDUCT</h3>

          <div className="text-text-subtle border-border-default border text-xs font-medium md:text-sm">
            <div className="border-border-default flex justify-between border-b px-2">
              <div className="line-clamp-1 w-3/5 flex-1 truncate py-2">Neatness</div>
              <div className="border-border-default line-clamp-1 w-2/5 truncate border-l py-2 pl-2 text-center">Good</div>
            </div>

            <div className="border-border-default flex justify-between border-b px-2">
              <div className="line-clamp-1 w-3/5 flex-1 truncate py-2">Punctuality</div>
              <div className="border-border-default line-clamp-1 w-2/5 truncate border-l py-2 pl-2 text-center">Good</div>
            </div>

            <div className="flex justify-between px-2">
              <div className="line-clamp-1 w-3/5 flex-1 truncate py-2">Diligence</div>
              <div className="border-border-default line-clamp-1 w-2/5 truncate border-l py-2 pl-2 text-center">Excellent</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-bg-subtle border-border-default flex flex-col border-t p-4">
        <h3 className="text-bg-basic-cyan-contrast text-center text-xs font-semibold md:text-sm">ACADEMIC REPORT</h3>

        <div className="mt-3 w-full">
          {/*TODO: Centralize text on the table */}
          <DataTable
            columns={columns}
            data={result}
            totalCount={result.length}
            page={page}
            setCurrentPage={setPage}
            pageSize={10}
            clickHandler={row => {
              console.log(row);
              // router.push(`/student-and-parent-record/${row.original.id}`);
            }}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            onSelectRows={setSelectedRows}
            fullBorder
            showPagination={false}
            classNames={{
              tableWrapper: "rounded-none",
            }}
          />
        </div>

        {/* Summary */}
        <div className="text-text-default mt-4 flex flex-col gap-4 text-sm font-normal">
          <div className="">
            <span>OVERALL PERCENTAGE:</span> <span className="font-medium">69%</span>
          </div>
          <div className="flex gap-1">
            <span className="text-text-subtle">Class Teacher&apos;s Comment: </span>{" "}
            <span className="border-border-default inline-block min-w-[150px] flex-1 border-b">This is an Excellent result</span>
          </div>

          <div className="flex gap-1">
            <span className="text-text-subtle">Principal&apos;s Comment:</span>{" "}
            <span className="border-border-default inline-block min-w-[150px] flex-1 border-b"></span>
          </div>

          <div className="flex gap-1">
            <span className="text-text-subtle">Next Term Begins:</span>{" "}
            <span className="border-border-default inline-block min-w-[150px] flex-1 border-b">15 June, 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};
