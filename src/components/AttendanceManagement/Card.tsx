"use client";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Time from "../Icons/Time";
import NumStudentIcon from "../Icons/NumStudentIcon";
import Approve from "../Icons/Approve";
import ArrowOpenRight from "../Icons/ArrowOpenRight";

interface CardProps {
  classname: string;
  totalStudents: string;
  teacherName: string;
  lastUpdate: "Today" | "Yesterday" | "None";
  attendancePercentage: string;
  viewLabel?: string;
}

export function Card({ classname, totalStudents, teacherName, lastUpdate, attendancePercentage, viewLabel = "Open" }: CardProps) {
  const updateStyles =
    lastUpdate === "Today"
      ? "bg-bg-badge-green text-bg-basic-green-strong"
      : lastUpdate === "Yesterday"
        ? "bg-bg-badge-orange text-bg-basic-orange-strong"
        : "bg-bg-badge-default text-text-muted";

  const updateIconColor =
    lastUpdate === "Today"
      ? "var(--color-bg-basic-green-strong)"
      : lastUpdate === "Yesterday"
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
          <NumStudentIcon fill="var(--color-icon-default-muted)" /> {totalStudents}
        </Badge>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className={`${updateStyles} border-border-default flex items-center gap-1 rounded-md border p-1 text-xs font-medium md:max-w-42`}>
          <Time fill={updateIconColor} /> {lastUpdate ? `Last Updated ${lastUpdate}` : "No Attendance Record"}
        </p>

        {lastUpdate && (
          <p className="border-border-default text-bg-basic-cyan-strong bg-bg-badge-cyan flex items-center gap-1 rounded-md border p-1 text-xs font-medium">
            <Approve fill="var(--color-bg-basic-cyan-strong)" /> {attendancePercentage}
          </p>
        )}
      </div>

      <Button className="border-border-darker bg-bg-state-secondary text-text-default flex h-7 items-center gap-2 rounded-md border p-2">
        <span className="text-sm font-medium">{viewLabel}</span>
        <ArrowOpenRight fill="var(--color-icon-default-muted)" className="size-3" />
      </Button>
    </li>
  );
}
