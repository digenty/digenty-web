"use client";

import { PromotionBySubjectReport } from "@/api/types";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { PromotionStudent } from "../students";

const RenderAction = <T extends { studentId: number }>(
  row: Row<T>,
  onSetDecision: (student: T) => void,
  decisions: { studentId: number; className?: string; armName?: string; status: string }[],
  promotionType: string,
) => {
  const decision = decisions.find(d => d.studentId === row.original.studentId);

  const getButtonText = () => {
    if (!decision) return "Set Decision";
    if (promotionType === "PROMOTE_ALL") return "Next Class";
    if (decision.status === "PROMOTED" && decision.className && decision.armName) {
      return `Promote to ${decision.className} ${decision.armName}`;
    }
    if (decision.status === "REPEAT") return "Repeat";
    // if (decision.status === "GRADUATED") return "Graduate";
    return "Set Decision";
  };

  return (
    <Button
      className="border-border-darker bg-bg-state-secondary! text-text-muted h-7! w-fit border px-4 font-normal"
      onClick={() => onSetDecision(row.original)}
    >
      {getButtonText()}
      <ChevronDown className="text-text-muted" />
    </Button>
  );
};

export const createPromotionColumns = (
  data: PromotionStudent[],
  onSetDecision: (student: PromotionStudent) => void,
  decisions: { studentId: number; className?: string; armName?: string; status: string }[],
  promotionType: string,
  minimumScore: number,
): ColumnDef<PromotionStudent>[] => {
  if (!data.length) return [];

  const columns: ColumnDef<PromotionStudent>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()}
            onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox checked={row.getIsSelected()} onCheckedChange={(value: boolean) => row.toggleSelected(!!value)} aria-label="Select row" />
        </div>
      ),
      size: 50,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: () => <div className="text-text-muted text-sm font-medium">Id</div>,
    },

    {
      accessorKey: "studentName",
      header: () => (
        <div className="text-text-muted absolute top-0 left-0 flex h-14 w-70 items-center pl-2 text-left! text-sm font-medium">Student Name</div>
      ),
      cell: ({ row }) => (
        <div className="flex w-70 items-center gap-2">
          <Avatar className="size-8" />
          <span className="text-text-default text-sm">{row.original.studentName}</span>
        </div>
      ),
      size: 400,
      minSize: 400,
    },

    {
      accessorKey: "firstTermPercentage",
      header: () => <span className="text-text-muted truncate text-sm font-medium">1st Term %</span>,
      cell: ({ row }) => (
        <span className="text-text-default text-sm">{row.original.firstTermPercentage && row.original.firstTermPercentage?.toFixed(2)}%</span>
      ),
      size: 136,
      minSize: 136,
    },

    {
      accessorKey: "secondTermPercentage",
      header: () => <span className="text-text-muted truncate text-sm font-medium">2nd Term %</span>,
      cell: ({ row }) => (
        <span className="text-text-default text-sm">{row.original.secondTermPercentage && row.original.secondTermPercentage?.toFixed(2)}%</span>
      ),
      size: 136,
      minSize: 136,
    },

    {
      accessorKey: "thirdTermPercentage",
      header: () => <span className="text-text-muted truncate text-sm font-medium">3rd Term %</span>,
      cell: ({ row }) => (
        <span className="text-text-default text-sm">{row.original.thirdTermPercentage && row.original.thirdTermPercentage?.toFixed(2)}%</span>
      ),
      size: 136,
      minSize: 136,
    },

    {
      accessorKey: "cumulativePercentage",
      header: () => <span className="text-text-muted truncate text-sm font-medium">Cumulative %</span>,
      cell: ({ row }) => {
        const cumulative =
          ((row.original.firstTermPercentage || 0) + (row.original.secondTermPercentage || 0) + (row.original.thirdTermPercentage || 0)) / 3;
        return <span className="text-text-default text-sm">{cumulative.toFixed(2)}%</span>;
      },
      size: 136,
      minSize: 136,
    },
  ];

  if (promotionType === "BY_PERFORMANCE") {
    columns.push({
      accessorKey: "suggestion",
      header: () => <span className="text-text-muted truncate text-sm font-medium">Suggestion</span>,
      cell: ({ row }) => {
        const cumulative =
          ((row.original.firstTermPercentage || 0) + (row.original.secondTermPercentage || 0) + (row.original.thirdTermPercentage || 0)) / 3;
        const suggestion = cumulative >= minimumScore ? "Promote" : "Repeat";
        return (
          <span className="text-text-default text-sm">
            <Badge
              className={cn(
                "border-border-default rounded-md border",
                suggestion === "Promote" && "text-text-success",
                suggestion === "Repeat" && "text-text-warning",
              )}
            >
              {suggestion}
            </Badge>
          </span>
        );
      },
      size: 136,
      minSize: 136,
    });
  }

  columns.push({
    id: "actions",
    header: () => (
      <div className="text-text-muted cursor-pointer text-sm font-medium">
        {promotionType === "PROMOTE_ALL" ? "Next Class" : "Promotion Decision"}
      </div>
    ),
    cell: ({ row }) => RenderAction(row, onSetDecision, decisions, promotionType),
    size: 209,
    minSize: 209,
  });

  return columns;
};

export const createSubjectCombinationColumns = (
  subjectNames: string[],
  onSetDecision: (student: PromotionBySubjectReport) => void,
  decisions: { studentId: number; className?: string; armName?: string; status: string }[],
  promotionType: string,
  minimumScore: number,
): ColumnDef<PromotionBySubjectReport>[] => {
  // Find Student Name column to insert subjects after it
  const selectCol: ColumnDef<PromotionBySubjectReport> = {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()}
          onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(value: boolean) => row.toggleSelected(!!value)} aria-label="Select row" />
      </div>
    ),
    size: 50,
  };

  const nameCol: ColumnDef<PromotionBySubjectReport> = {
    accessorKey: "studentName",
    header: () => <div className="text-text-muted flex h-14 items-center pl-2 text-left! text-sm font-medium">Student Name</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="size-8" />
        <span className="text-text-default text-sm">{row.original.studentName}</span>
      </div>
    ),
    size: 250,
    minSize: 250,
  };

  const subjectColumns = subjectNames.map(subject => ({
    id: subject,
    header: () => <span className="text-text-muted truncate text-sm font-medium">{subject}</span>,
    cell: ({ row }: { row: Row<PromotionBySubjectReport> }) => {
      const subjectScore = row.original.subjects?.find(s => s.subjectName === subject);
      return <span className="text-text-default text-sm">{subjectScore?.score ?? 0}</span>;
    },
    size: 100,
    minSize: 100,
  }));

  const statsColumns = [
    {
      accessorKey: "total",
      header: () => <span className="text-text-muted truncate text-sm font-medium">Total</span>,
      cell: ({ row }: { row: Row<PromotionBySubjectReport> }) => <span className="text-text-default text-sm">{row.original.total ?? 0}</span>,
      size: 100,
    },
    {
      accessorKey: "percentage",
      header: () => <span className="text-text-muted truncate text-sm font-medium">Percentage %</span>,
      cell: ({ row }: { row: Row<PromotionBySubjectReport> }) => (
        <span className="text-text-default text-sm">{row.original.percentage && row.original.percentage?.toFixed(2)}%</span>
      ),
      size: 120,
    },
    {
      accessorKey: "suggestion",
      header: () => <span className="text-text-muted truncate text-sm font-medium">Suggestion</span>,
      cell: ({ row }: { row: Row<PromotionBySubjectReport> }) => {
        const suggestion = row.original.percentage >= minimumScore ? "Promote" : "Repeat";
        return (
          <span className="text-text-default text-sm">
            <Badge
              className={cn(
                "border-border-default rounded-md border",
                suggestion === "Promote" && "text-text-success",
                suggestion === "Repeat" && "text-text-warning",
              )}
            >
              {suggestion}
            </Badge>
          </span>
        );
      },
      size: 136,
      minSize: 136,
    },
  ];

  const actionCol: ColumnDef<PromotionBySubjectReport> = {
    id: "actions",
    header: () => <div className="text-text-muted text-sm font-medium">Promotion Decision</div>,
    cell: ({ row }: { row: Row<PromotionBySubjectReport> }) => RenderAction(row, onSetDecision, decisions, promotionType),
    size: 200,
  };

  return [selectCol, nameCol, ...subjectColumns, ...statsColumns, actionCol] as ColumnDef<PromotionBySubjectReport>[];
};
