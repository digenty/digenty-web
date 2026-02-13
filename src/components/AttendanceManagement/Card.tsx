"use client";
import { formatRelativeDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import ArrowOpenRight from "../Icons/ArrowOpenRight";
import NumStudentIcon from "../Icons/NumStudentIcon";
import { TimeFill } from "../Icons/TimeFill";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface CardProps {
  classname: string;
  totalStudents: string;
  teacherName: string;
  lastUpdate: Date;
  attendancePercentage: string;
  viewLabel?: string;
}

export function Card({ classname, totalStudents, teacherName, lastUpdate, attendancePercentage, viewLabel = "Open" }: CardProps) {
  const router = useRouter();
  const updateStyles =
    formatRelativeDate(lastUpdate) === "Today"
      ? "bg-bg-badge-green text-bg-basic-green-strong"
      : formatRelativeDate(lastUpdate) === "Yesterday"
        ? "bg-bg-badge-orange text-bg-basic-orange-strong"
        : "bg-bg-badge-default text-text-muted";

  const updateIconColor =
    formatRelativeDate(lastUpdate) === "Today"
      ? "var(--color-bg-basic-green-strong)"
      : formatRelativeDate(lastUpdate) === "Yesterday"
        ? "var(--color-bg-basic-orange-strong)"
        : "var(--color-text-muted)";

  return (
    <li className="bg-bg-subtle border-border-default flex flex-col gap-4 rounded-md border p-4 md:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-default text-xs font-medium">{classname}</p>
          <p className="text-text-muted pt-2 text-xs font-normal">{teacherName}</p>
        </div>
        <Badge className="border-border-default bg-bg-badge-default text-text-muted flex items-center gap-1 rounded-md text-xs font-normal">
          <NumStudentIcon fill="var(--color-icon-default-muted)" /> {totalStudents} Student{totalStudents !== "1" && "s"}
        </Badge>
      </div>

      <div className="flex flex-col gap-4">
        <p className={`${updateStyles} border-border-default flex w-fit items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium`}>
          <TimeFill fill={updateIconColor} /> {lastUpdate ? `Last Updated ${formatRelativeDate(lastUpdate)}` : "No Attendance Record"}
        </p>

        {lastUpdate && (
          <div className="text-bg-basic-cyan-strong flex items-center gap-1 p-1 text-xs font-medium">
            <div className="bg-bg-basic-cyan-accent flex size-2 items-center justify-center rounded-full p-1" /> {attendancePercentage} Attendance
          </div>
        )}
      </div>

      <Button
        onClick={() => router.push(`/attendance/${classname.replace(/\s+/g, "-").toLowerCase()}`)}
        className="border-border-darker bg-bg-state-secondary text-text-default flex h-7 items-center gap-2 rounded-md border p-2"
      >
        <span className="text-sm font-medium">{viewLabel}</span>
        <ArrowOpenRight fill="var(--color-icon-default-muted)" className="size-3" />
      </Button>
    </li>
  );
}
