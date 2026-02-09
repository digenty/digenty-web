"use client";

import { Avatar } from "@/components/Avatar";
import { ColumnDef, Row } from "@tanstack/react-table";
import { StudentRow } from "./students";
import { toOrdinal } from "@/components/ClassesAndSubjects/utils";

export const createColumns = (data: StudentRow[], term: string): ColumnDef<StudentRow>[] => {
  const firstStudent = data[0];
  const termIndex = firstStudent.terms.findIndex(t => t.term === term);
  const subjects = firstStudent.terms[termIndex].subjects;

  const subjectColumns: ColumnDef<StudentRow>[] = subjects.map((subject, index) => ({
    id: `subject-${index}`,
    header: () => (
      <span className="text-text-muted truncate text-sm font-medium">
        {subject.subjectName.length > 15 ? subject.subjectName.slice(0, 15) + "..." : subject.subjectName}
      </span>
    ),
    size: 136,
    minSize: 136,
    cell: ({ row }) => {
      const term = row.original.terms[termIndex];
      const score = term.subjects[index]?.score ?? 0;
      return <span className="text-text-default text-sm">{score}</span>;
    },
  }));

  const totalScoreColumn = {
    id: "total",
    header: () => <span className="text-text-muted truncate text-sm font-medium">Total</span>,
    size: 136,
    minSize: 136,
    cell: ({ row }: { row: Row<StudentRow> }) => {
      const student = data[row.index];
      const subjects = student.terms.find(t => t.term === term)?.subjects ?? [];
      const total = subjects.reduce((acc, s) => acc + s.score, 0);
      return <span className="text-text-default text-sm">{total}</span>;
    },
  };

  const percentage = {
    id: "percentage",
    header: () => <span className="text-text-muted truncate text-sm font-medium">Percentage</span>,
    size: 136,
    minSize: 136,
    cell: ({ row }: { row: Row<StudentRow> }) => {
      const student = data[row.index];
      const subjects = student.terms.find(t => t.term === term)?.subjects ?? [];
      const total = subjects.reduce((acc, s) => acc + s.score, 0);
      return <span className="text-text-default text-sm">{(total / 500) * 100}</span>;
    },
  };

  const position = {
    id: "position",
    header: () => <span className="text-text-muted truncate text-sm font-medium">Position</span>,
    size: 136,
    minSize: 136,
    cell: ({ row }: { row: Row<StudentRow> }) => {
      const student = data[row.index];
      const position = student.terms.find(t => t.term === term)?.position ?? 0;
      return <span className="text-text-default text-sm">{toOrdinal(position)}</span>;
    },
  };

  return [
    {
      accessorKey: "s/n",
      header: () => <span className="text-text-muted pr-2 text-sm font-medium">S/N</span>,
      cell: ({ row }) => <span className="text-text-default pr-2 text-sm">{row.index + 1}</span>,
      size: 50,
      maxSize: 50,
    },

    {
      accessorKey: "name",
      header: () => (
        <div className="text-text-muted absolute top-0 left-0 flex h-14 w-70 items-center pl-2 text-left! text-sm font-medium">Student Name</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex w-70 items-center gap-2">
            <Avatar className="size-8" />
            <span className="text-text-default text-sm">{row.original.name}</span>
          </div>
        );
      },
      size: 400,
      minSize: 400,
    },

    ...subjectColumns,
    totalScoreColumn,
    percentage,
    position,
  ];
};
