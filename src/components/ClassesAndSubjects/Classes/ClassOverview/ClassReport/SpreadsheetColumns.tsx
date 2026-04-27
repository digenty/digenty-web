"use client";

import { Avatar } from "@/components/Avatar";
import { toOrdinal } from "@/components/ClassesAndSubjects/utils";
import ShareBox from "@/components/Icons/ShareBox";
import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { usePathname } from "next/navigation";
import { StudentRow } from "./students";

export const createColumns = (data: StudentRow[], term: string, showDecisionColumn = false): ColumnDef<StudentRow>[] => {
  if (!data.length) return [];

  const firstStudent = data[0];
  const termData = firstStudent.terms.find(t => t.term === term);
  if (!termData) return [];

  const subjects = termData.subjects;

  const RenderViewButon = (row: Row<StudentRow>) => {
    const pathname = usePathname();

    return (
      <div>
        <Button
          className="text-text-default border-border-default border text-xs"
          onClick={() => {
            const params = new URLSearchParams(window.location.search);
            params.set("studentId", String(row.original.id));
            window.open(`${pathname}?${params.toString()}`, "_blank", "noopener,noreferrer");
          }}
        >
          View
          <ShareBox fill="var(--color-icon-default-muted)" className="size-3" />
        </Button>
      </div>
    );
  };

  const subjectColumns: ColumnDef<StudentRow>[] = subjects.map((subject, index) => ({
    id: `subject-${index}`,
    header: () => (
      <span className="text-text-muted truncate text-sm font-medium capitalize">
        {subject.subjectName && subject.subjectName.length > 15
          ? subject.subjectName.toLowerCase().slice(0, 15) + "..."
          : subject.subjectName.toLowerCase()}
      </span>
    ),
    size: 136,
    minSize: 136,
    cell: ({ row }) => {
      const termData = row.original.terms.find(t => t.term === term);
      const score = termData?.subjects[index]?.score ?? 0;
      return <span className="text-text-default text-sm">{score}</span>;
    },
  }));

  const totalScoreColumn: ColumnDef<StudentRow> = {
    id: "total",
    header: () => <span className="text-text-muted truncate text-sm font-medium">Total</span>,
    size: 136,
    minSize: 136,
    cell: ({ row }: { row: Row<StudentRow> }) => {
      const termData = row.original.terms.find(t => t.term === term);
      const total = termData?.subjects.reduce((acc, s) => acc + s.score, 0) ?? 0;
      return <span className="text-text-default text-sm">{total}</span>;
    },
  };

  const percentageColumn: ColumnDef<StudentRow> = {
    id: "percentage",
    header: () => <span className="text-text-muted truncate text-sm font-medium">Percentage</span>,
    size: 136,
    minSize: 136,
    cell: ({ row }: { row: Row<StudentRow> }) => {
      const termData = row.original.terms.find(t => t.term === term);
      return <span className="text-text-default text-sm">{termData?.totalPercentage?.toFixed(0) ?? 0}%</span>;
    },
  };

  const positionColumn: ColumnDef<StudentRow> = {
    id: "position",
    header: () => <span className="text-text-muted truncate text-sm font-medium">Position</span>,
    size: 136,
    minSize: 136,
    cell: ({ row }: { row: Row<StudentRow> }) => {
      const termData = row.original.terms.find(t => t.term === term);
      return <span className="text-text-default text-sm">{toOrdinal(termData?.position ?? 0)}</span>;
    },
  };

  const promotionDecisionColumn: ColumnDef<StudentRow> = {
    id: "promotionDecision",
    header: () => <span className="text-text-muted truncate text-sm font-medium">Promotion Decision</span>,
    size: 180,
    minSize: 180,
    cell: ({ row }: { row: Row<StudentRow> }) => {
      const raw = row.original.decision;
      const display = raw ? raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase() : "Not set by teacher";
      return <span className="text-text-default text-sm font-normal">{display}</span>;
    },
  };

  return [
    {
      accessorKey: "class_report_s/n",
      header: () => <span className="text-text-muted pr-2 text-sm font-medium">S/N</span>,
      cell: ({ row }) => <span className="text-text-default pr-2 text-sm">{row.index + 1}</span>,
      size: 50,
      maxSize: 50,
    },
    {
      accessorKey: "class_report_name",
      header: () => (
        <div className="text-text-muted absolute top-0 left-0 flex h-14 w-70 items-center pl-2 text-left! text-sm font-medium">Student Name</div>
      ),
      cell: ({ row }) => (
        <div className="flex w-70 items-center gap-2">
          <Avatar className="size-8" />
          <span className="text-text-default text-sm">{row.original.name}</span>
        </div>
      ),
      size: 400,
      minSize: 400,
    },
    ...subjectColumns,
    totalScoreColumn,
    percentageColumn,
    positionColumn,
    ...(showDecisionColumn ? [promotionDecisionColumn] : []),
    {
      accessorKey: "view",
      header: () => <span className="text-text-muted pr-2 text-sm font-medium"></span>,
      cell: ({ row }) => RenderViewButon(row),
      size: 50,
      maxSize: 50,
    },
  ];
};
