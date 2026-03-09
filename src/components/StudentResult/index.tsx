import { StudentReport, SubjectReport, Term } from "@/api/types";
import { ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";
import { DataTable } from "../DataTable";
import { ErrorComponent } from "../Error/ErrorComponent";

export type Result = {
  subject: string;
  total: number;
  grade: string;
  remark: string;
  [key: string]: string | number;
};

export const columns = (headers: string[]): ColumnDef<Result>[] => [
  {
    accessorKey: "subject",
    header: () => <div className="text-text-muted flex justify-center text-sm font-medium">Subject</div>,
    cell: ({ row }: { row: Row<Result> }) => (
      <span className="text-text-default flex cursor-pointer justify-center pl-0 text-sm">{row.original.subject}</span>
    ),
    size: 340,
  },

  ...headers.map(column => ({
    id: String(column),
    accessorFn: (row: Result) => row[column],
    header: () => <div className="text-text-muted flex justify-center text-center text-sm font-medium">{column}</div>,
    cell: ({ row }: { row: Row<Result> }) => (
      <span className="text-text-default flex justify-center text-sm font-normal">{row.original[column]}</span>
    ),
    size: 200,
  })),
  {
    accessorKey: "total",
    header: () => <div className="text-text-muted flex justify-center text-sm font-medium">Total</div>,
    cell: ({ row }: { row: Row<Result> }) => (
      <span className="text-text-default flex cursor-pointer justify-center pl-0 text-sm">{row.original.total}</span>
    ),
    size: 340,
  },
  {
    accessorKey: "grade",
    header: () => <div className="text-text-muted flex justify-center text-sm font-medium">Grade</div>,
    cell: ({ row }: { row: Row<Result> }) => (
      <span className="text-text-default flex cursor-pointer justify-center pl-0 text-sm">{row.original.grade}</span>
    ),
    size: 340,
  },
  {
    accessorKey: "remark",
    header: () => <div className="text-text-muted flex justify-center text-sm font-medium">Remark</div>,
    cell: ({ row }: { row: Row<Result> }) => (
      <span className="text-text-default flex cursor-pointer justify-center pl-0 text-sm">{row.original.remark}</span>
    ),
    size: 340,
  },
];

export const StudentResult = ({ studentReport, termSelected }: { studentReport: StudentReport; termSelected: Term | null }) => {
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<Result[]>([]);

  function toTitleCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const transformAssessmentData = (data: SubjectReport[]) => {
    return data.map(subject => {
      const assessmentScores = subject.assessments.reduce(
        (acc, a) => {
          const key = a.assessmentName;
          acc[key] = a.score;
          return acc;
        },
        {} as Record<string, number>,
      );

      return {
        subject: toTitleCase(subject.subjectName),
        ...assessmentScores,
        total: subject.total,
        grade: subject.grade ?? "-",
        remark: subject.remark ?? "Poor",
      } as Result;
    });
  };

  const headers =
    studentReport.subjectReports.length > 0
      ? studentReport.subjectReports[0].assessments.map(assessment => assessment.assessmentName)
      : ["Total", "Grade", "Remark"];

  return (
    <div className="border-t-bg-basic-cyan-contrast border-x-border-default border-b-border-default mb-10 border-x border-t-2 border-b">
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
          <h3 className="text-bg-basic-red-accent text-sm font-semibold md:text-sm">CONDUCT</h3>
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
              columns={columns(headers)}
              data={transformAssessmentData(studentReport.subjectReports)}
              totalCount={transformAssessmentData(studentReport.subjectReports).length}
              page={page}
              setCurrentPage={setPage}
              pageSize={10}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              onSelectRows={setSelectedRows}
              fullBorder
              showPagination={false}
              classNames={{
                tableWrapper: "rounded-none",
                tableHeadCell: "px-2",
                tableBodyCell: "px-0",
              }}
            />
          </div>
        ) : (
          <div className="my-10 flex items-center justify-center">
            <ErrorComponent title="No Academic Record" description="No academic record for this term" />
          </div>
        )}

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
