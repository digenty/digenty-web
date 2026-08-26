"use client";

import { Avatar } from "@/components/Avatar";
import { cn } from "@/lib/utils";
import { ColumnDef, Row } from "@tanstack/react-table";
import { CheckIcon, XIcon } from "lucide-react";

import { StudentAttendance } from "@/api/types";
import type { SessionSlot } from ".";

const StudentsAttendanceToggle = ({
  isPresent,
  isAbsent,
  onSetPresent,
  onSetAbsent,
}: {
  isPresent: boolean;
  isAbsent: boolean;
  onSetPresent: () => void;
  onSetAbsent: () => void;
}) => {
  return (
    <div className="full-cell absolute top-0 bottom-0 flex h-full w-full cursor-pointer items-center justify-center">
      <div
        role="button"
        onClick={evt => {
          evt.stopPropagation();
          onSetPresent();
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
          onSetAbsent();
        }}
        className={cn("flex h-full w-1/2 items-center justify-center", isAbsent && "bg-bg-badge-red")}
      >
        <XIcon className={cn("text-icon-default-muted size-4.5 justify-self-center", isAbsent && "text-icon-destructive")} />
      </div>
    </div>
  );
};

const buildSessionColumn = (slot: SessionSlot) => ({
  id: slot.session,
  header: () => <div className="text-text-muted flex items-center justify-center text-sm font-medium">{slot.label}</div>,
  cell: ({ row }: { row: Row<StudentAttendance> }) => {
    const studentId = row.original.studentId;
    const record = slot.attendanceList.find(s => s.studentId === studentId);
    const initial = slot.students.find(s => s.studentId === studentId)?.isPresent;
    const currentValue = record ? record.isPresent : initial;

    const setValue = (isPresent: boolean) =>
      slot.setAttendanceList(prev => {
        const exists = prev.find(s => s.studentId === studentId);
        if (exists) return prev.map(s => (s.studentId === studentId ? { ...s, isPresent } : s));
        return [...prev, { studentId, isPresent }];
      });

    return (
      <StudentsAttendanceToggle
        isPresent={currentValue === true}
        isAbsent={currentValue === false}
        onSetPresent={() => setValue(true)}
        onSetAbsent={() => setValue(false)}
      />
    );
  },
});

export const getColumns = (slots: SessionSlot[]): ColumnDef<StudentAttendance>[] => [
  {
    accessorKey: "s/n",
    header: () => <div className="text-text-muted inline-block w-0.5 text-sm font-medium">S/N</div>,
    cell: ({ row }) => <span className="text-text-default inline-block h-6 w-0.5 cursor-pointer text-sm">{row.index + 1}</span>,
    size: 20,
    maxSize: 20,
  },
  {
    accessorKey: "name",
    header: () => <div className="text-text-muted text-sm font-medium">Student Name</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <Avatar className="size-5" />
        <span className="text-text-default cursor-pointer text-sm">{row.original.studentName}</span>
      </div>
    ),
    size: 900,
  },
  slots.length > 1
    ? {
        id: "attendance",
        header: () => <div className="text-text-muted flex justify-center text-sm font-medium">Attendance</div>,
        columns: slots.map(buildSessionColumn),
      }
    : { accessorKey: "attendance", ...buildSessionColumn(slots[0]) },
];
