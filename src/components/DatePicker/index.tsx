"use client";

import * as React from "react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { DatePickerIcon } from "../Icons/DatePickerIcon";

type DateRangePickerProps = {
  value: DateRange | undefined;
  onChange: (value: DateRange | undefined) => void;
  label?: string;
  className?: string;
};

export function DateRangePicker({ value, onChange, label, className }: DateRangePickerProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      {label && <label className="text-text-default text-sm font-normal">{label}</label>}

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("bg-bg-input-soft! text-text-default w-full justify-between border-none", className)}>
            {value?.from ? (
              value.to ? (
                <>{format(value.from, "dd/MM/yyyy")}</>
              ) : (
                format(value.from, "dd/MM/yyyy")
              )
            ) : (
              <span className="text-text-muted">dd / mm / yyyy</span>
            )}

            <DatePickerIcon className="size-4 opacity-60" fill="var(--color-icon-default-muted)" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="bg-bg-card! p-0">
          <Calendar
            mode="range"
            selected={value}
            onSelect={onChange}
            numberOfMonths={1}
            initialFocus
            className="text-text-default"
            modifiers={{
              today: new Date(),
            }}
            modifiersClassNames={{
              today: "bg-text-informative text-text-white-default hover:bg-bg-state-primary! rounded-md",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
