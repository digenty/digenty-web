"use client";

import { Avatar } from "@/components/Avatar";
import { ColumnDef, Row } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { AttendanceDay, AttendanceWeek, StudentAttendance } from "./students";

const RenderCell = (row: Row<StudentAttendance>, week: string, day: AttendanceDay) => {
  const studentWeek = row.original.weeks.find(wk => wk.week === week);

  const record = studentWeek?.days.find(dy => dy.date === day.date);
  const [isPresent, setIsPresent] = useState(record?.isPresent);

  const toggleAttendance = () => {
    setIsPresent(prev => !prev);
  };

  return (
    <div
      role="button"
      onClick={() => toggleAttendance()}
      className="full-cell absolute top-0 bottom-0 flex h-full w-full cursor-pointer items-center justify-center"
    >
      {isPresent ? <CheckIcon className="text-bg-basic-emerald-strong size-4.5" /> : <XIcon className="text-icon-destructive size-4.5" />}
    </div>
  );
};

export const generateColumns = ({ weeks, totalStudents }: { weeks: AttendanceWeek[]; totalStudents: number }): ColumnDef<StudentAttendance>[] => {
  return [
    {
      accessorKey: "name",

      header: () => (
        <div className="bg-bg-muted fill-header text-text-muted absolute -top-10 left-0 flex h-20 w-full flex-col justify-center pl-4 font-medium">
          <p>Student Name</p>
          <p>{totalStudents} Total</p>
        </div>
      ),
      meta: { rowSpan: 2 },
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-8" />
            <span className="text-text-default text-sm">{student.studentName}</span>
          </div>
        );
      },
    },

    ...weeks.map(week => ({
      id: week.week,
      header: () => <div className="fill-header text-text-muted flex items-center justify-center text-center text-sm">{week.week}</div>,
      columns: week.days.map(day => ({
        id: `${week.week}-${day.date}`,
        header: () => (
          <span className="text-text-muted flex items-center justify-center text-center text-sm">{format(parseISO(day.date), "MMM d")}</span>
        ),
        cell: ({ row }: { row: Row<StudentAttendance> }) => RenderCell(row, week.week, day),
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
        const percentage = Math.round((total.totalPresent / total.totalSchoolDays) * 100);

        return (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-text-default text-xs">{percentage}%</div>
            <div className="text-text-muted text-xs">
              {total.totalPresent}/{total.totalSchoolDays} day{total.totalSchoolDays > 1 ? "s" : ""}
            </div>
          </div>
        );
      },
    },
  ];
};
