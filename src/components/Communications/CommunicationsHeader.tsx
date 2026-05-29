"use client";

import { Calendar } from "@digenty/icons";
import { useState } from "react";

import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const dateRanges = ["Last 7 days", "Last 30 days", "Last 90 days", "This year"];

export const CommunicationsHeader = () => {
  const [dateRange, setDateRange] = useState(dateRanges[1]);

  useBreadcrumb([{ label: "Communications", url: "/staff/communications" }]);

  return (
    <div className="flex w-full items-center justify-between">
      <h2 className="text-text-default text-xl font-semibold">Overview</h2>

      <Select value={dateRange} onValueChange={setDateRange}>
        <SelectTrigger className="border-border-darker h-8! w-auto border">
          <SelectValue>
            <div className="flex items-center gap-2">
              <Calendar fill="var(--color-icon-black-muted)" className="size-4" />
              <span className="text-text-default text-sm font-medium">Date Range</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-bg-card border-border-default">
          {dateRanges.map(range => (
            <SelectItem key={range} value={range} className="text-text-default text-sm font-medium">
              {range}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
