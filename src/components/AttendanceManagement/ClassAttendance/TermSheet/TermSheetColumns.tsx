"use client";

import { Avatar } from "@/components/Avatar";
import { ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { CheckIcon, XIcon } from "lucide-react";
import { AttendanceWeek, StudentAttendance } from "./students";

export const generateColumns = (weeks: AttendanceWeek[]): ColumnDef<StudentAttendance>[] => {
  return [
    {
      accessorKey: "name",
      header: () => (
        <div className="bg-bg-muted fill-header text-text-muted absolute -top-10 left-0 flex h-20 w-full flex-col justify-center pl-4 font-medium">
          <p>Student Name</p>
          <p>10 Total</p>
        </div>
      ),
      meta: { rowSpan: 2 },
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar username={row.original.name} className="size-8" />
            <span>{student.name}</span>
          </div>
        );
      },
    },

    ...weeks.map(week => ({
      id: week.week,
      header: () => <div className="fill-header text-text-muted text-center text-sm">{week.week}</div>,
      columns: week.days.map(day => ({
        id: `${week.week}-${day.date}`,
        header: () => <span className="text-text-muted pl-6 text-center text-sm">{format(new Date(day.date), "MMMM d")}</span>,
        cell: ({ row }: { row: Row<StudentAttendance> }) => {
          const studentWeek = row.original.weeks.find(wk => wk.week === week.week);

          const record = studentWeek?.days.find(dy => dy.date === day.date);

          const isPresent = record?.present;

          return (
            <div className="full-cell absolute top-0 bottom-0 flex h-full w-full items-center justify-center">
              {isPresent ? <CheckIcon className="text-bg-basic-emerald-strong size-4.5" /> : <XIcon className="text-icon-destructive size-4.5" />}
            </div>
          );
        },
      })),
    })),

    {
      id: "totalAttendance",
      accessorKey: "total",
      header: () => (
        <div className="border-border-default bg-bg-muted fill-header text-text-muted absolute -top-10 left-0 flex h-20 w-full flex-col items-center justify-center border-l font-medium">
          Total
        </div>
      ),
      cell: ({ row }) => {
        const total = row.original;
        const percentage = Math.round((total.totalPresent / total.totalDays) * 100);

        return (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-text-default text-xs">{percentage}%</div>
            <div className="text-text-muted text-xs">
              {total.totalPresent}/{total.totalDays} days
            </div>
          </div>
        );
      },
    },
  ];
};
