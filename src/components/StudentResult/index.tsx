import { StudentReport, Term } from "@/api/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";
import { DataTable } from "../DataTable";
import { ErrorComponent } from "../Error/ErrorComponent";

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

export const StudentResult = ({ studentReport, termSelected }: { studentReport: StudentReport; termSelected: Term | null }) => {
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<Result[]>([]);

  return (
    <div className="border-t-bg-basic-cyan-contrast border-x-border-default border-b-border-default border-x border-t-2 border-b">
      <div className="flex flex-col items-center justify-center py-3">
        <h1 className="text-bg-basic-cyan-contrast text-xl font-semibold">{studentReport.schoolName}</h1>
        <p className="text-text-muted text-sm font-normal capitalize">
          {studentReport.sessionName} {termSelected?.term.toLowerCase()}
        </p>
      </div>

      <div className="border-border-default text-text-default flex justify-between border-y px-4 py-2.5 text-sm font-normal">
        <span>
          Name: <span className="font-medium">{studentReport.studentName}</span>
        </span>
        <span>
          Class: <span className="font-medium">{studentReport.className}</span>
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
              <div className="border-border-default w-1/4 border-l py-2 pl-2 text-center">{studentReport.totalSchoolDays}</div>
            </div>

            <div className="border-border-default flex justify-between border-b px-2">
              <div className="line-clamp-1 w-3/4 flex-1 truncate py-2">
                <span className="hidden lg:inline">No. of </span>
                <span>Times Present:</span>
              </div>
              <div className="border-border-default w-1/4 border-l py-2 pl-2 text-center">{studentReport.totalPresent}</div>
            </div>

            <div className="flex justify-between px-2">
              <div className="line-clamp-1 w-3/4 flex-1 truncate py-2">
                <span className="hidden lg:inline">No. of </span>
                <span>Times Absent:</span>
              </div>
              <div className="border-border-default w-1/4 border-l py-2 pl-2 text-center">{studentReport.totalAbsent}</div>
            </div>
          </div>
        </div>

        <div className="w-1/2 space-y-2">
          <h3 className="text-bg-basic-red-accent text-xs font-semibold md:text-sm">CONDUCT</h3>

          <div className="text-text-subtle border-border-default border text-xs font-medium md:text-sm">
            <div className="border-border-default flex justify-between border-b px-2">
              <div className="line-clamp-1 w-3/5 flex-1 truncate py-2">Neatness</div>
              <div className="border-border-default line-clamp-1 w-2/5 truncate border-l py-2 pl-2 text-center">{studentReport.neatness ?? "--"}</div>
            </div>

            <div className="border-border-default flex justify-between border-b px-2">
              <div className="line-clamp-1 w-3/5 flex-1 truncate py-2">Punctuality</div>
              <div className="border-border-default line-clamp-1 w-2/5 truncate border-l py-2 pl-2 text-center">
                {studentReport.punctuality ?? "--"}
              </div>
            </div>

            <div className="flex justify-between px-2">
              <div className="line-clamp-1 w-3/5 flex-1 truncate py-2">Diligence</div>
              <div className="border-border-default line-clamp-1 w-2/5 truncate border-l py-2 pl-2 text-center">
                {studentReport.diligence ?? "--"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-bg-subtle border-border-default flex flex-col border-t p-4">
        <h3 className="text-bg-basic-cyan-contrast text-center text-xs font-semibold md:text-sm">ACADEMIC REPORT</h3>

        {studentReport.subjectReports.length > 0 ? (
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
        ) : (
          <div className="my-10 flex items-center justify-center">
            <ErrorComponent title="No Academic Record" description="No academic record for this term" />
          </div>
        )}

        {/* Summary */}
        <div className="text-text-default mt-4 flex flex-col gap-4 text-sm font-normal">
          <div className="">
            <span>OVERALL PERCENTAGE:</span> <span className="font-medium">{studentReport.overallPercentage}%</span>
          </div>
          <div className="flex flex-col gap-2.5 md:flex-row md:gap-1">
            <span className="text-text-subtle">Class Teacher&apos;s Comment: </span>{" "}
            <span className="border-border-default inline-block min-w-[150px] flex-1 border-b">{studentReport.classTeacherComment ?? "--"}</span>
          </div>

          <div className="flex flex-col gap-2.5 md:flex-row md:gap-1">
            <span className="text-text-subtle">Principal&apos;s Comment:</span>{" "}
            <span className="border-border-default inline-block min-w-[150px] flex-1 border-b">{studentReport.principalComment ?? "--"}</span>
          </div>

          <div className="flex flex-col gap-2.5 md:flex-row md:gap-1">
            <span className="text-text-subtle">Next Term Begins:</span>{" "}
            <span className="border-border-default inline-block min-w-[150px] flex-1 border-b">
              {studentReport.nextTermBegins ? format(studentReport.nextTermBegins, "d MMMM, yyyy") : "--"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
