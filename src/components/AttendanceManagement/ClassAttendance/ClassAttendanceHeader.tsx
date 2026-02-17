"use client";

import ListCheck from "@/components/Icons/ListCheck";
import { toast } from "@/components/Toast";
import { Spinner } from "@/components/ui/spinner";
import { useMarkAllAttendance, useMarkAttendance } from "@/hooks/queryHooks/useAttendance";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { format } from "date-fns";
import { CheckIcon, XIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Calendar from "../../Icons/Calendar";
import { Button } from "../../ui/button";
import { Calendar as AttendanceCalendar } from "../../ui/calendar";
import { Select, SelectContent, SelectTrigger, SelectValue } from "../../ui/select";

import { StudentAttendance } from "@/api/types";

export const ClassAttendanceHeader = ({
  classArmName,
  attendanceList,
  setAttendanceList,
  students,
  date,
  setDate,
}: {
  classArmName: string;
  attendanceList: { studentId: number; isPresent: boolean }[];
  setAttendanceList: React.Dispatch<React.SetStateAction<{ studentId: number; isPresent: boolean }[]>>;
  students: StudentAttendance[];
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const attendanceId = pathname.split("/")[4] ?? "";
  const armId = pathname.split("/")[2] ?? "";

  const { mutate: saveAttendance, isPending: saving } = useMarkAttendance();
  const { mutate: markAllAttendance, isPending: markingAll } = useMarkAllAttendance();

  useBreadcrumb([
    { label: "Attendance Management", url: "/attendance" },
    { label: `${classArmName} Attendance`, url: "" },
  ]);

  const [open, setOpen] = React.useState(false);
  const [isAllPresent, setIsAllPresent] = React.useState(false);

  const handleSaveAttendance = () => {
    saveAttendance(
      {
        attendanceId: Number(attendanceId),
        studentAttendanceList: attendanceList,
      },
      {
        onSuccess: data => {
          toast({
            title: "Attendance saved successfully",
            description: data.message,
            type: "success",
          });
        },
        onError: () => {
          toast({
            title: "Failed to save attendance",
            type: "error",
          });
        },
      },
    );
  };

  const handleMarkAllAttendance = (isPresent: boolean) => {
    setIsAllPresent(isPresent);
    setAttendanceList(students.map(student => ({ studentId: student.studentId, isPresent })));
    markAllAttendance(
      {
        armId: Number(armId),
        date: date.toISOString(),
        isPresent,
      },
      {
        onSuccess: data => {
          toast({
            title: `All students marked as ${isPresent ? "Present" : "Absent"}`,
            description: data.message,
            type: "success",
          });
        },
        onError: () => {
          toast({
            title: `Failed to mark all students ${isPresent ? "Present" : "Absent"}`,
            type: "error",
          });
        },
      },
    );
  };

  return (
    <div className="border-border-default flex w-full flex-col items-start justify-between border-b py-2 align-middle md:flex-row md:items-center md:py-3">
      <div className="border-border-default flex w-full items-center gap-2 border-b px-4 md:border-none md:px-8">
        <h2 className="text-text-default text-lg font-semibold md:text-xl">{classArmName.toUpperCase()}</h2>

        <div className="hidden gap-1 md:flex">
          <Button
            disabled={markingAll}
            onClick={() => handleMarkAllAttendance(true)}
            className="bg-bg-state-soft text-text-subtle flex h-8! items-center gap-2"
          >
            {markingAll && isAllPresent ? <Spinner /> : <CheckIcon className="text-icon-default-muted size-4" />}
            <span className="text-text-default text-sm font-medium">Mark All Present</span>
          </Button>

          <Button
            disabled={markingAll}
            onClick={() => handleMarkAllAttendance(false)}
            className="bg-bg-state-soft text-text-subtle flex h-8! items-center gap-2"
          >
            {markingAll && !isAllPresent ? <Spinner /> : <XIcon className="text-icon-default-muted size-4" />}
            <span className="text-text-default text-sm font-medium">Mark All Absent</span>
          </Button>
        </div>
      </div>

      <div className="scollbar-hide flex w-full gap-2 overflow-x-auto px-4 py-2 align-middle md:w-auto md:overflow-x-visible md:px-8 md:py-0">
        <Button onClick={() => router.push(`${pathname}/term-sheet`)} className="border-border-darker flex h-8! items-center gap-2 border">
          <ListCheck fill="var(--color-icon-default-muted)" className="size-3" />
          <span className="text-text-default text-sm font-medium">See Term Sheet</span>
        </Button>

        <Select open={open} onOpenChange={setOpen} defaultValue="Today">
          <SelectTrigger className="border-border-darker h-8! w-fit border focus-visible:ring-0">
            <SelectValue>
              <div className="flex items-center gap-2">
                <Calendar fill="var(--color-icon-default-muted )" className="size-4" />
                <span className="text-text-default text-sm font-medium"> {date ? format(date, "PP") : "Today"}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default">
            <AttendanceCalendar
              className="text-text-default"
              mode="single"
              selected={date}
              onSelect={date => {
                setDate(date as Date);
                setOpen(false);
              }}
            />
          </SelectContent>
        </Select>

        <Button
          onClick={handleSaveAttendance}
          className="bg-bg-state-primary text-text-white-default! hover:bg-bg-state-primary-hover! flex h-8! items-center gap-2"
        >
          {saving && <Spinner className="text-text-white-default" />}
          <span className="text-sm font-medium">Save</span>
        </Button>
      </div>

      <div className="border-border-default scollbar-hide flex w-full gap-2 overflow-x-auto border-t px-4 pt-2 md:hidden md:px-8">
        <Button disabled={markingAll} onClick={() => handleMarkAllAttendance(true)} className="bg-bg-state-soft flex h-8! items-center gap-2 px-5!">
          {markingAll && isAllPresent ? <Spinner /> : <CheckIcon className="text-icon-default-muted size-4" />}
          <span className="text-text-subtle text-sm font-medium">Mark All Present</span>
        </Button>

        <Button disabled={markingAll} onClick={() => handleMarkAllAttendance(false)} className="bg-bg-state-soft flex h-8! items-center gap-2 px-5!">
          {markingAll && !isAllPresent ? <Spinner /> : <XIcon className="text-icon-default-muted size-4" />}
          <span className="text-text-subtle text-sm font-medium">Mark All Absent</span>
        </Button>
      </div>
    </div>
  );
};
