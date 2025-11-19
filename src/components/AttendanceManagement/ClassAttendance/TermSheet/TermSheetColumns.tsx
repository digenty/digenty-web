"use client";

import { Avatar } from "@/components/Avatar";
import { cn } from "@/lib/utils";
import { ColumnDef, Row } from "@tanstack/react-table";
import { CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Student } from ".";
import { format } from "date-fns";
import { AttendanceWeek, StudentAttendance } from "./students";

const RenderAttendance = (row: Row<Student>) => {
  console.log(row);
  const [isPresent, setIsPresent] = useState(false);
  const [isAbsent, setIsAbsent] = useState(false);

  const markPresent = () => {
    // API calls will happen here. Using state temporarily
    setIsPresent(true);
    setIsAbsent(false);
  };

  const markAbsent = () => {
    // API calls will happen here. Using state temporarily
    setIsAbsent(true);
    setIsPresent(false);
  };

  return (
    <div className="full-cell absolute top-0 bottom-0 flex h-full w-full cursor-pointer items-center justify-center">
      <div
        role="button"
        onClick={evt => {
          evt.stopPropagation();
          markPresent();
        }}
        className={cn("flex h-full w-1/2 items-center justify-center", isPresent && "bg-bg-badge-emerald")}
      >
        <CheckIcon className={cn("text-icon-default-muted size-4.5 justify-self-center", isPresent && "text-bg-basic-emerald-strong")} />
      </div>

      <div className="border-border-default h-full border-r" />

      <div
        role="button"
        onClick={evt => {
          evt.stopPropagation();
          markAbsent();
        }}
        className={cn("flex h-full w-1/2 items-center justify-center", isAbsent && "bg-bg-badge-red")}
      >
        <XIcon className={cn("text-icon-default-muted size-4.5 justify-self-center", isAbsent && "text-icon-destructive")} />
      </div>
    </div>
  );
};

// export const columns: ColumnDef<Student>[] = [
//   {
//     accessorKey: "s/n",
//     header: () => <div className="text-text-muted inline-block w-0.5 text-sm font-medium">S/N</div>,
//     cell: ({ row }) => <span className="text-text-default inline-block h-6 w-0.5 cursor-pointer text-sm">{row.index + 1}</span>,
//     size: 20,
//     maxSize: 20,
//   },
//   {
//     accessorKey: "name",
//     header: () => <div className="text-text-muted text-sm font-medium">Student Name</div>,
//     cell: ({ row }) => (
//       <div className="flex items-center gap-1.5">
//         <Avatar username="Damilare John" className="size-5" />
//         <span className="text-text-default cursor-pointer text-sm">{row.original.name}</span>
//       </div>
//     ),
//     size: 900,
//   },
//   {
//     accessorKey: "attendance",
//     header: () => <div className="text-text-muted w-32 text-sm font-medium">Attendance</div>,
//     cell: ({ row }) => RenderAttendance(row),
//   },
// ];

export const generateColumns = (weeks: AttendanceWeek[]): ColumnDef<StudentAttendance>[] => {
  return [
    // =====================
    // STUDENT COLUMN
    // =====================
    {
      accessorKey: "name",
      header: () => <div className="font-semibold">Student Name</div>,
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center gap-3">
            <img src={student.avatar} className="h-8 w-8 rounded-full" alt="avatar" />
            <span>{student.name}</span>
          </div>
        );
      },
    },

    // =====================
    // WEEK → DAYS GROUPED COLUMNS
    // =====================
    ...weeks.map(week => ({
      header: week.week,
      columns: week.days.map(day => ({
        id: `${week.week}-${day.date}`,
        header: () => (
          <span className="text-xs whitespace-nowrap">
            {format(new Date(day.date), "do MMM")} {/* e.g. 24th Jun */}
          </span>
        ),
        cell: ({ row }: { row: Row<StudentAttendance> }) => {
          console.log(row, "!!!");
          const studentWeek = row.original.weeks.find(w => w.week === week.week);

          const record = studentWeek?.days.find(d => d.date === day.date);

          const isPresent = record?.present;

          return (
            <div className="flex justify-center">
              {isPresent ? <span className="text-lg text-green-600">✔</span> : <span className="text-lg text-red-500">✖</span>}
            </div>
          );
        },
      })),
    })),

    // =====================
    // TOTAL COLUMN
    // =====================
    {
      header: "Total",
      cell: ({ row }) => {
        const s = row.original;
        const percentage = Math.round((s.totalPresent / s.totalDays) * 100);

        return (
          <div className="text-right">
            <div className="font-semibold">{percentage}%</div>
            <div className="text-xs text-gray-500">
              {s.totalPresent}/{s.totalDays} days
            </div>
          </div>
        );
      },
    },
  ];
};
