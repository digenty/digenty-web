"use client";

import { Calendar, ListCheck } from "@digenty/icons";
import { toast } from "@/components/Toast";
import { Spinner } from "@/components/ui/spinner";
import { useMarkAllAttendance, useMarkAttendance } from "@/hooks/queryHooks/useAttendance";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { format } from "date-fns";
import { CheckIcon, XIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

import { Button } from "../../ui/button";
import { Calendar as AttendanceCalendar } from "../../ui/calendar";
import { Select, SelectContent, SelectTrigger, SelectValue } from "../../ui/select";

import { Term } from "@/api/types";
import { SessionSlot } from ".";

export const ClassAttendanceHeader = ({
  classArmName,
  slots,
  date,
  setDate,
  activeTerm,
}: {
  classArmName: string;
  slots: SessionSlot[];
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  activeTerm?: Term;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const armId = pathname.split("/")[4] ?? "";

  const { mutateAsync: saveAttendanceAsync, isPending: savePending } = useMarkAttendance();
  const { mutateAsync: markAllAsync, isPending: markAllPending } = useMarkAllAttendance();

  const [isSaving, setIsSaving] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [isAllPresent, setIsAllPresent] = useState(false);

  const saving = isSaving || savePending;
  const markingAll = isMarkingAll || markAllPending;

  useBreadcrumb([
    { label: "Attendance Management", url: "/staff/attendance" },
    { label: `${classArmName} Attendance`, url: "" },
  ]);

  const [open, setOpen] = React.useState(false);

  const handleSaveAttendance = async () => {
    const readySlots = slots.filter(slot => slot.attendanceId);
    const blockedSlots = slots.filter(slot => !slot.attendanceId);

    if (readySlots.length === 0) {
      toast({ title: "Please wait", description: "The attendance sheet is still being prepared", type: "error" });
      return;
    }

    setIsSaving(true);
    try {
      const results = await Promise.allSettled(
        readySlots.map(slot => saveAttendanceAsync({ attendanceId: slot.attendanceId as number, studentAttendanceList: slot.attendanceList })),
      );

      const failedSlots = readySlots.filter((_, index) => results[index].status === "rejected");
      const unsavedLabels = [...blockedSlots, ...failedSlots].map(slot => slot.label);

      if (unsavedLabels.length === 0) {
        toast({ title: "Attendance saved successfully", type: "success" });
      } else if (failedSlots.length === readySlots.length) {
        toast({ title: "Failed to save attendance", type: "error" });
      } else {
        toast({
          title: "Attendance partially saved",
          description: `Could not save: ${unsavedLabels.join(", ")}. The rest was saved successfully.`,
          type: "error",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkAllAttendance = async (isPresent: boolean) => {
    setIsAllPresent(isPresent);
    slots.forEach(slot => slot.setAttendanceList(slot.students.map(student => ({ studentId: student.studentId, isPresent }))));

    setIsMarkingAll(true);
    try {
      await Promise.all(
        slots.map(slot =>
          markAllAsync({
            armId: Number(armId),
            date: format(date, "yyyy-MM-dd"),
            isPresent,
            ...(slot.session === "FULL_DAY" ? {} : { attendanceSession: slot.session }),
          }),
        ),
      );
      toast({ title: `All students marked as ${isPresent ? "Present" : "Absent"}`, type: "success" });
    } catch {
      toast({ title: `Failed to mark all students ${isPresent ? "Present" : "Absent"}`, type: "error" });
    } finally {
      setIsMarkingAll(false);
    }
  };

  return (
    <div className="border-border-default flex w-full flex-col items-start justify-between border-b py-2 align-middle lg:flex-row lg:items-center lg:py-3">
      <div className="border-border-default flex w-full items-center gap-2 border-b px-4 lg:border-none lg:px-8">
        <h2 className="text-text-default line-clamp-1 text-lg font-semibold md:text-xl">{classArmName.toUpperCase()}</h2>

        <div className="hidden gap-1 lg:flex">
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

      <div className="hide-scrollbar w-screen overflow-x-auto px-4 py-2 lg:w-auto lg:overflow-x-visible lg:px-8 lg:py-0">
        <div className="flex w-max items-center gap-2 md:w-auto">
          <Button
            onClick={() => router.push(`/staff/attendance/${classArmName.split(" ").join("-")}/${armId}/term-sheet`)}
            className="border-border-darker flex h-8! items-center gap-2 border"
          >
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
                onSelect={selected => {
                  const newDate = selected as Date;
                  setDate(newDate);
                  setOpen(false);
                }}
                disabled={[
                  { dayOfWeek: [0, 6] },
                  ...(activeTerm?.startDate ? [{ before: new Date(activeTerm.startDate) }] : []),
                  ...(activeTerm?.endDate ? [{ after: new Date(activeTerm.endDate) }] : []),
                ]}
              />
            </SelectContent>
          </Select>

          <Button
            onClick={handleSaveAttendance}
            disabled={saving}
            className="bg-bg-state-primary text-text-white-default! hover:bg-bg-state-primary-hover! flex h-8! items-center gap-2"
          >
            {saving && <Spinner className="text-text-white-default" />}
            <span className="text-sm font-medium">Save</span>
          </Button>
        </div>
      </div>

      <div className="border-border-default hide-scrollbar flex w-screen gap-2 overflow-x-auto border-t px-4 pt-2 lg:hidden lg:px-8">
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
