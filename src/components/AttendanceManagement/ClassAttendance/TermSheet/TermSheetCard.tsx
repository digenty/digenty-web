"use client";
import { Avatar } from "@/components/Avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, Dot, XIcon } from "lucide-react";
import { AttendanceDay, StudentAttendance } from "./students";

export const TermSheetCard = ({
  student,
  days,
  activeStudent,
  setActiveStudent,
}: {
  student: StudentAttendance;
  days?: AttendanceDay[];
  activeStudent?: string;
  setActiveStudent: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const toggleCard = () => {
    setActiveStudent(prev => (prev === student.id ? undefined : student.id));
  };

  return (
    <div className="">
      <div
        role="button"
        onClick={toggleCard}
        className={cn(
          "bg-bg-subtle border-border-default flex items-center justify-between border p-3",
          activeStudent === student.id ? "rounded-t-sm" : "rounded-sm",
        )}
      >
        <div className="flex gap-3">
          <Avatar className="border-border-default size-10 border" />
          <div className="text-text-default flex flex-col text-sm">
            <span className="font-medium">Damilare John</span>
            <div className="flex items-center gap-0.5 text-xs">
              <span>17/20 days</span> <Dot className="size-2" /> <span className="font-medium">85%</span>
            </div>
          </div>
        </div>

        {activeStudent === student.id ? (
          <ChevronUpIcon className="text-icon-default-muted size-4" />
        ) : (
          <ChevronDownIcon className="text-icon-default-muted size-4" />
        )}
      </div>

      {activeStudent === student.id && (
        <div className="border-border-default hide-scrollbar flex w-full overflow-x-auto rounded-b-sm border-x border-b">
          {days?.map(day => {
            return (
              <div
                key={day.date}
                className="border-border-default text-text-muted flex flex-1 flex-col items-center gap-1 justify-self-center border-r px-5 py-3 last:border-r-0"
              >
                <span className="w-5.5 text-center text-xs">{format(new Date(day.date), "MMM d")}</span>
                {/* TODO: User should be able to edit attendance here */}
                <div role="button" className="border-border-default flex size-8 items-center justify-center rounded-sm border">
                  {day.present ? <CheckIcon className="text-bg-basic-emerald-strong size-5" /> : <XIcon className="text-icon-destructive size-5" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
