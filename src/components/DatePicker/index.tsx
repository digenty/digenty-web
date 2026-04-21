"use client";

import * as React from "react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { DateRange, Matcher } from "react-day-picker";
import { cn } from "@/lib/utils";
import { DatePickerIcon } from "../Icons/DatePickerIcon";
import { CalendarIcon } from "lucide-react";

type DateRangePickerProps = {
  setDate: (value: Date | undefined) => void;
  label?: string;
  className?: string;
  disabled?: Matcher | Matcher[];

  date: Date | undefined;
  // setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

export function DateRangePicker({ label, className, disabled, date, setDate }: DateRangePickerProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      {label && <label className="text-text-default text-sm font-normal">{label}</label>}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "text-text-muted bg-bg-input-soft! focus-visible:border-border-default! hover:bg-bg-input-soft! hover:text-text-default!m w-full border-none text-sm font-normal shadow-none focus-visible:border!",
            )}
          >
            {date ? format(date, "dd/MM/yyyy") : <span className="text-text-muted font-light">DD / MM / YYYY</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-bg-card! p-0!" align="start">
          <Calendar
            // disabled={{
            //   after: new Date(),
            // }}
            mode="single"
            required
            selected={date}
            onSelect={date => {
              setDate(date);
              // formik.setFieldValue("dateOfBirth", date);
            }}
            captionLayout="dropdown"
            className="bg-bg-card w-full border-none"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
