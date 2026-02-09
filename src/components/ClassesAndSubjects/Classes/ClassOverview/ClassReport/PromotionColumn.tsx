"use client";

import { Avatar } from "@/components/Avatar";
import { ColumnDef, Row } from "@tanstack/react-table";
import { StudentRow } from "./students";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const termsOptions = ["First Term", "Second Term", "Third Term"];
const actions = ["Promote", "Repeat", "Double Promotion"];
const RenderAction = (row: Row<StudentRow>) => {
  const [actionSelected, setActionSelected] = useState(actions[0]);

  return (
    <div className="">
      <Select value={actionSelected} onValueChange={setActionSelected}>
        <SelectTrigger className="border-border-darker bg-bg-state-secondary! h-8! w-full border">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span className="text-text-default text-sm font-medium">{actionSelected}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-bg-card border-border-default">
          {actions.map(action => (
            <SelectItem key={action} value={action} className="text-text-default text-sm">
              {action}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export const createPromotionColumns = (data: StudentRow[]): ColumnDef<StudentRow>[] => {
  const firstStudent = data[0];

  const termScores = termsOptions.map((term, index) => {
    const activeTerm = firstStudent.terms.find(t => t.term === term);
    const percentageScoreForTerm = activeTerm?.totalPercentage ?? 0;

    return {
      id: `subject-${index}`,
      header: () => <span className="text-text-muted truncate text-sm font-medium">{activeTerm?.term} %</span>,
      size: 136,
      minSize: 136,
      cell: () => {
        return <span className="text-text-default text-sm">{percentageScoreForTerm}</span>;
      },
    };
  });

  const cumulativeScore = {
    id: "cumulative",
    header: () => <span className="text-text-muted truncate text-sm font-medium">Cumulative</span>,
    size: 136,
    minSize: 136,
    cell: ({ row }: { row: Row<StudentRow> }) => {
      const student = data[row.index];
      const terms = student.terms;
      const cumulative = terms.reduce((acc, t) => acc + t.totalPercentage, 0) / terms.length;
      return <span className="text-text-default text-sm">{Math.floor(cumulative)}</span>;
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

    ...termScores,

    cumulativeScore,

    {
      id: "actions",
      header: () => <div className="text-text-muted cursor-pointer text-sm font-medium"></div>,
      cell: ({ row }) => RenderAction(row),
      size: 209,
      minSize: 209,
    },
  ];
};
