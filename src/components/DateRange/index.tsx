"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarEventFill } from "../Icons/CalendarEventFill";

type DateRangePickerProps = {
  from?: Date;
  to?: Date;
  onChange: (range: { from?: Date; to?: Date }) => void;
  className?: string;
};

function formatDate(date?: Date) {
  if (!date) return <span className="text-text-hint">dd/ mm / yyy</span>;
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function DateRangePicker({ from, to, onChange, className }: DateRangePickerProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 md:flex-row md:justify-between", className)}>
      {/* From */}
      <div className="flex w-full flex-col gap-1">
        <Label className="text-text-default text-sm font-medium">
          Issued Date <span className="text-text-destructive">*</span>{" "}
        </Label>
        <Popover>
          <PopoverTrigger asChild className="bg-bg-input-soft! max-w-full">
            <Button variant="outline" className="h-9 justify-between gap-2 border-none px-3 text-sm font-medium">
              <span> {formatDate(from)}</span> <CalendarEventFill fill="var(--color-icon-default-muted)" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-bg-card text-text-default border-border-default w-auto p-0">
            <Calendar mode="single" selected={from} onSelect={date => onChange({ from: date, to })} />
          </PopoverContent>
        </Popover>
      </div>

      {/* TO */}
      <div className="flex w-full flex-col gap-1">
        <Label className="text-text-default text-sm font-medium">Due Date</Label>
        <Popover>
          <PopoverTrigger asChild className="bg-bg-input-soft! max-w-full">
            <Button variant="outline" className="h-9 justify-between gap-2 border-none px-3 text-sm font-medium">
              <span> {formatDate(to)}</span>
              <CalendarEventFill fill="var(--color-icon-default-muted)" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-bg-card text-text-default border-border-default w-auto p-0">
            <Calendar mode="single" selected={to} disabled={date => (from ? date < from : false)} onSelect={date => onChange({ from, to: date })} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
