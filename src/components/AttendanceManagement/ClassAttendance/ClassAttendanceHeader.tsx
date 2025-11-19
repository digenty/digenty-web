"use client";

import ListCheck from "@/components/Icons/ListCheck";
import { CheckIcon, XIcon } from "lucide-react";
import React from "react";
import Calendar from "../../Icons/Calendar";
import { Button } from "../../ui/button";
import { Calendar as AttendanceCalendar } from "../../ui/calendar";
import { Select, SelectContent, SelectTrigger, SelectValue } from "../../ui/select";
import { format } from "date-fns";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { usePathname, useRouter } from "next/navigation";

export const ClassAttendanceHeader = ({ classname }: { classname: string }) => {
  const router = useRouter();
  const pathname = usePathname();

  useBreadcrumb([
    { label: "Attendance Management", url: "/attendance" },
    { label: `${classname} Attendance`, url: "" },
  ]);

  const [date, setDate] = React.useState<Date>(new Date());
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-border-default flex w-full flex-col items-start justify-between border-b py-2 align-middle md:flex-row md:items-center md:py-3">
      <div className="border-border-default flex w-full items-center gap-2 border-b px-4 md:border-none md:px-8">
        <h2 className="text-text-default text-lg font-semibold md:text-xl">{classname.toUpperCase()}</h2>

        <div className="hidden gap-1 md:flex">
          <Button className="bg-bg-state-soft text-text-subtle flex h-8! items-center gap-2">
            <CheckIcon className="text-icon-default-muted size-4" />
            <span className="text-text-default text-sm font-medium">Mark All Present</span>
          </Button>

          <Button className="bg-bg-state-soft text-text-subtle flex h-8! items-center gap-2">
            <XIcon className="text-icon-default-muted size-4" />
            <span className="text-text-default text-sm font-medium">Mark All Absent</span>
          </Button>
        </div>
      </div>

      <div className="flex gap-2 px-4 py-2 align-middle md:px-8 md:py-0">
        <Button onClick={() => router.push(`${pathname}/term-sheet`)} className="border-border-darker flex h-8! items-center gap-2 border">
          <ListCheck fill="var(--color-icon-default-muted)" className="size-3" />
          <span className="text-text-default text-sm font-medium">See Term Sheet</span>
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
              className="text-text-default hidden md:block"
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

      <div className="border-border-default flex w-full gap-2 border-t px-4 pt-2 md:hidden md:px-8">
        <Button className="bg-bg-state-soft flex h-8! items-center gap-2 px-5!">
          <CheckIcon className="text-icon-default-muted size-4" />
          <span className="text-text-subtle text-sm font-medium">Mark All Present</span>
        </Button>

        <Button className="bg-bg-state-soft flex h-8! items-center gap-2 px-5!">
          <XIcon className="text-icon-default-muted size-4" />
          <span className="text-text-subtle text-sm font-medium">Mark All Absent</span>
        </Button>
      </div>
    </div>
  );
};
