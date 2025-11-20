"use client";

import Calendar from "@/components/Icons/Calendar";
import ListCheck from "@/components/Icons/ListCheck";
import { Button } from "@/components/ui/button";
import { Calendar as AttendanceCalendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React from "react";
import { AttendanceWeek } from "./students";

export const TermSheetHeader = ({
  classname,
  termWeeks,
  activeWeek,
  setActiveWeek,
}: {
  classname: string;
  termWeeks: AttendanceWeek[];
  activeWeek: string;
  setActiveWeek: (week: string) => void;
}) => {
  useBreadcrumb([
    { label: "Attendance Management", url: "/attendance" },
    { label: `${classname} Attendance`, url: "" },
    { label: "Term Sheet", url: "" },
  ]);

  const [date, setDate] = React.useState<Date>(new Date());
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-border-default flex w-full flex-col items-start justify-between border-b py-2 align-middle md:flex-row md:items-center md:py-3">
      <div className="border-border-default w-full border-b px-4 pb-2 md:border-none md:px-8 md:pb-0">
        <h2 className="text-text-default text-lg font-semibold md:text-xl">{classname.toUpperCase()}</h2>
      </div>

      <div className="scrollbar-hide flex w-full gap-2 overflow-x-auto px-4 py-2 align-middle md:w-auto md:overflow-visible md:px-8 md:py-0">
        <Button className="border-border-darker bg-bg-state-secondary-press flex h-8! items-center gap-2 border">
          <ListCheck fill="var(--color-icon-default-disabled)" className="size-3" />
          <span className="text-text-hint text-sm font-medium">See Term Sheet</span>
        </Button>

        <Select open={open} onOpenChange={setOpen} defaultValue="Today">
          <SelectTrigger className="border-border-darker h-8! w-fit border focus-visible:ring-0">
            <SelectValue>
              <div className="flex items-center gap-2">
                <Calendar fill="var(--color-icon-default-muted )" className="size-4" />
                <span className="text-text-default text-sm font-medium"> {date ? format(date, "P") : "Today"}</span>
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
                // setOpen(false);
              }}
            />
          </SelectContent>
        </Select>

        <Button className="bg-bg-state-primary text-text-white-default! hover:bg-bg-state-primary-hover! flex h-8! items-center gap-2">
          <span className="text-sm font-medium">Save</span>
        </Button>
      </div>

      <div className="border-border-default scrollbar-hide flex w-full gap-2 overflow-x-auto border-t px-4 pt-2 md:hidden md:px-8">
        {termWeeks.map(week => (
          <span
            key={week.week}
            role="button"
            onClick={() => setActiveWeek(week.week)}
            className={cn(
              "bg-bg-state-soft text-text-subtle w-fit rounded-md px-2 py-1 text-sm text-nowrap",
              activeWeek === week.week && "bg-bg-state-primary text-text-white-default",
            )}
          >
            {week.week}
          </span>
        ))}
      </div>
    </div>
  );
};
