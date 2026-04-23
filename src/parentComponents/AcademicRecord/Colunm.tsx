import { ColumnDef, Row } from "@tanstack/react-table";
import { Result } from "./types";

export const mockReport = {
  schoolName: "Digenty Technology School",
  sessionName: "2024/2025",
  term: "First Term",
  studentName: "Damilare John",
  className: "JSS 1 A",
  totalSchoolDays: 90,
  totalPresent: 85,
  totalAbsent: 5,
  neatness: "Excellent",
  punctuality: "Good",
  diligence: "Very Good",
  overallPercentage: 78,
  classTeacherComment: "A focused and dedicated student.",
  principalComment: "Keep up the good work.",
  nextTermBegins: "January 13, 2025",
};

export const mockResults: Result[] = [
  { subject: "Mathematics", ca1: 18, ca2: 17, exam: 55, total: 90, grade: "A", remark: "Excellent" },
  { subject: "English Language", ca1: 15, ca2: 16, exam: 50, total: 81, grade: "B", remark: "Very Good" },
  { subject: "Basic Science", ca1: 14, ca2: 13, exam: 48, total: 75, grade: "B", remark: "Good" },
];

const headers = ["ca1", "ca2", "exam"];

export const columns: ColumnDef<Result>[] = [
  {
    accessorKey: "subject",
    header: () => <div className="text-text-muted flex justify-center text-xs font-medium md:text-sm">Subject</div>,
    cell: ({ row }: { row: Row<Result> }) => <span className="text-text-default flex justify-center text-xs md:text-sm">{row.original.subject}</span>,
    size: 340,
  },
  ...headers.map(col => ({
    id: col,
    accessorFn: (row: Result) => row[col],
    header: () => <div className="text-text-muted flex justify-center text-xs font-medium uppercase md:text-sm">{col}</div>,
    cell: ({ row }: { row: Row<Result> }) => <span className="text-text-default flex justify-center text-xs md:text-sm">{row.original[col]}</span>,
    size: 200,
  })),
  {
    accessorKey: "total",
    header: () => <div className="text-text-muted flex justify-center text-xs font-medium md:text-sm">Total</div>,
    cell: ({ row }) => <span className="text-text-default flex justify-center text-xs md:text-sm">{row.original.total}</span>,
    size: 200,
  },
  {
    accessorKey: "grade",
    header: () => <div className="text-text-muted flex justify-center text-xs font-medium md:text-sm">Grade</div>,
    cell: ({ row }) => <span className="text-text-default flex justify-center text-xs md:text-sm">{row.original.grade}</span>,
    size: 200,
  },
  {
    accessorKey: "remark",
    header: () => <div className="text-text-muted flex justify-center text-xs font-medium md:text-sm">Remark</div>,
    cell: ({ row }) => <span className="text-text-default flex justify-center text-xs md:text-sm">{row.original.remark}</span>,
    size: 200,
  },
];
