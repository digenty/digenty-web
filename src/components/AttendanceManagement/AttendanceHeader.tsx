"use client";

import Image from "next/image";
import React, { useState } from "react";
import Calendar from "../Icons/Calendar";
import School from "../Icons/School";
import { MobileDrawer } from "../MobileDrawer";
import { Button } from "../ui/button";
import { Calendar as AttendanceCalendar } from "../ui/calendar";
import { DrawerClose, DrawerFooter } from "../ui/drawer";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const branches = ["Lawanson", "Ilasamaja"];

export default function AttendanceHeader() {
  const [branchSelected, setBranchSelected] = useState(branches[0]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-border-default flex w-full items-center justify-between border-b px-4 py-2 align-middle md:px-8 md:py-3">
      <h2 className="text-text-default text-lg font-semibold md:text-xl">Attendance Management</h2>

      <div className="hidden gap-2 align-middle md:flex">
        <Select value={branchSelected} onValueChange={setBranchSelected}>
          <SelectTrigger className="border-border-darker h-8! w-fit border focus-visible:ring-0">
            <SelectValue>
              <div className="flex items-center gap-2">
                <School fill="var(--color-icon-default-muted)" className="size-3" />
                <span className="text-text-default text-sm font-medium">{branchSelected}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default">
            {branches.map(branch => (
              <SelectItem key={branch} value={branch} className="text-text-default text-sm font-medium">
                {branch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select open={open} onOpenChange={setOpen} defaultValue="Today">
          <SelectTrigger className="border-border-darker h-8! w-fit border focus-visible:ring-0">
            <SelectValue>
              <div className="flex items-center gap-2">
                <Calendar fill="var(--color-icon-default-muted )" className="size-4" />
                <span className="text-text-default text-sm font-medium"> {date ? date.toLocaleDateString() : "Today"}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default border">
            <AttendanceCalendar
              className="text-text-default hidden md:block"
              mode="single"
              selected={date}
              onSelect={date => {
                setDate(date);
                setOpen(false);
              }}
            />
          </SelectContent>
        </Select>
      </div>

      <Button className="bg-bg-state-soft block size-7 rounded-md p-1.5 md:hidden" onClick={() => setIsFilterOpen(true)}>
        <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
      </Button>

      <MobileDrawer open={isFilterOpen} setIsOpen={setIsFilterOpen} title="Filter">
        <div className="flex w-full flex-col gap-4 p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <School fill="var(--color-icon-black-muted)" className="size-4" />
              <Label className="text-text-default text-sm font-medium">Branch</Label>
            </div>
            <Select value={branchSelected} onValueChange={setBranchSelected}>
              <SelectTrigger className="bg-bg-input-soft text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                <SelectValue>
                  <span className="text-text-default text-sm">{branchSelected}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-default border-border-default">
                {branches.map(branch => (
                  <SelectItem key={branch} value={branch} className="text-text-default text-sm">
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar fill="var(--color-icon-black-muted)" className="size-4" />
              <Label className="text-text-default text-sm font-medium">Period</Label>
            </div>
            <Select open={open} onOpenChange={setOpen} defaultValue="Today">
              <SelectTrigger className="bg-bg-input-soft text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
                <SelectValue>
                  <span className="text-text-default text-sm font-semibold"> {date ? date.toLocaleDateString() : "Today"}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-default border-border-default">
                <AttendanceCalendar
                  className="text-text-default border-border-default w-full border [--cell-size:--spacing(11)]"
                  mode="single"
                  selected={date}
                  onSelect={date => {
                    setDate(date);
                    setOpen(false);
                  }}
                />
              </SelectContent>
            </Select>
          </div>
        </div>

        <DrawerFooter className="border-border-default border-t">
          <div className="flex justify-between">
            <DrawerClose asChild>
              <Button className="bg-bg-state-soft text-text-subtle rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
            </DrawerClose>

            <Button className="bg-bg-state-primary text-text-white-default rounded-md! px-4 py-2 text-sm tracking-[0.1rem]">
              <span>Apply Filter</span>
              <span className="bg-bg-badge-white border-border-white rounded-sm px-1.5 py-0.5 text-xs">2</span>
            </Button>
          </div>
        </DrawerFooter>
      </MobileDrawer>
    </div>
  );
}
