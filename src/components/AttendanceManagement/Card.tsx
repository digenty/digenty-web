"use client";
import { ArrowOpenRight, ListCheck, NumStudentIcon, TimeFill } from "@digenty/icons";
import { formatRelativeDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useCreateAttendanceSheet } from "@/hooks/queryHooks/useAttendance";
import { useGetAttendanceSettingsByLevel } from "@/hooks/queryHooks/useAttendanceSettings";
import { toast } from "../Toast";
import { Spinner } from "../ui/spinner";

interface CardProps {
  classname: string;
  totalStudents: string;
  teacherName: string;
  lastUpdate: Date | null;
  attendancePercentage: number;
  viewLabel?: string;
  armId: number;
  levelId?: number;
}

export function Card({ classname, totalStudents, teacherName, lastUpdate, attendancePercentage, viewLabel = "Open", armId, levelId }: CardProps) {
  const router = useRouter();
  const { mutate, isPending } = useCreateAttendanceSheet();
  const { data: attendanceSettings } = useGetAttendanceSettingsByLevel(levelId);
  const sessionsPerDay: 1 | 2 = attendanceSettings?.data?.sessionsPerDay ?? 1;

  const createSheet = () => {
    mutate(
      {
        armId,
        ...(sessionsPerDay === 2 ? { attendanceSession: "MORNING" as const } : {}),
      },
      {
        onError: error => {
          toast({
            title: error.message ?? "Something went wrong",
            description: "Could not create or update attendance sheet",
            type: "error",
          });
        },
        onSuccess: data => {
          toast({
            title: "Getting the sheet ready....",
            type: "success",
          });

          router.push(`/staff/attendance/${classname.split(" ").join("-")}/${armId}/attendance-sheet/${data.data.id}`);
        },
      },
    );
  };

  const viewTermSheet = () => {
    router.push(`/staff/attendance/${classname.split(" ").join("-")}/${armId}/term-sheet`);
  };

  const relativeUpdate = lastUpdate ? formatRelativeDate(lastUpdate) : null;

  const updateStyles =
    relativeUpdate === "Today"
      ? "bg-bg-badge-green text-bg-basic-green-strong"
      : relativeUpdate === "Yesterday"
        ? "bg-bg-badge-orange text-bg-basic-orange-strong"
        : "bg-bg-badge-default text-text-muted";

  const updateIconColor =
    relativeUpdate === "Today"
      ? "var(--color-bg-basic-green-strong)"
      : relativeUpdate === "Yesterday"
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
          <TimeFill fill={updateIconColor} /> {relativeUpdate ? `Last Updated ${relativeUpdate}` : "No Attendance Record"}
        </p>

        {lastUpdate && (
          <div className="text-bg-basic-cyan-strong flex items-center gap-1 p-1 text-xs font-medium">
            <div className="bg-bg-basic-cyan-accent flex size-2 items-center justify-center rounded-full p-1" /> {attendancePercentage.toFixed(0)}%
            Attendance
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={createSheet}
          className="border-border-darker bg-bg-state-secondary text-text-default flex h-7 flex-1 items-center justify-center gap-2 rounded-md border p-2"
        >
          {isPending && <Spinner />}
          <span className="text-sm font-medium">{viewLabel}</span>
          <ArrowOpenRight fill="var(--color-icon-default-muted)" className="size-3" />
        </Button>

        <Button
          onClick={viewTermSheet}
          className="border-border-darker bg-bg-state-secondary text-text-default flex h-7 flex-1 items-center justify-center gap-2 rounded-md border p-2"
        >
          <span className="text-sm font-medium">View</span>
          <ListCheck fill="var(--color-icon-default-muted)" className="size-3" />
        </Button>
      </div>
    </li>
  );
}
