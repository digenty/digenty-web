"use client";

import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { useState } from "react";
import Calendar from "../Icons/Calendar";
import School from "../Icons/School";
import { MobileDrawer } from "../MobileDrawer";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import Group from "../Icons/Group";
import GraduationCap from "../Icons/GraduationCap";

// const termsOptions = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];
const branches = ["All Branches", "Lawanson", "Ilasamaja"];
const classes = ["JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3"];
const studentStatus = ["Active Students", "Graduated Students", "Withdrawn Students"];

export const RecordHeader = ({ tab }: { tab: string }) => {
  const [branchSelected, setBranchSelected] = useState(branches[0]);
  const [classSelected, setClassSelected] = useState(classes[0]);
  const [statusSelected, setStatusSelected] = useState(studentStatus[0]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div>
      <div className="flex w-full justify-between align-middle">
        <div className="flex items-center gap-2">
          <h2 className="text-text-default text-lg font-semibold md:text-2xl">{tab === "Parents" ? "Parents" : "Students"}</h2>
          {tab === "Parents" && (
            <div className="bg-bg-badge-cyan border-border-default text-bg-basic-cyan-strong flex h-5 w-7 items-center justify-center rounded-md border text-xs">
              35
            </div>
          )}
        </div>

        <div className="hidden gap-2 align-middle md:flex">
          <Select value={branchSelected} onValueChange={setBranchSelected}>
            <SelectTrigger className="border-border-darker h-8! w-auto border">
              <SelectValue>
                <Image src="/icons/school.svg" alt="branch" width={14} height={14} />
                <span className="text-text-default text-sm font-medium">{branchSelected}</span>
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

          {tab === "Students" && (
            <Select value={classSelected} onValueChange={setClassSelected}>
              <SelectTrigger className="border-border-darker h-8! w-auto border">
                <SelectValue>
                  <GraduationCap fill="var(--color-icon-black-muted )" className="size-4" />
                  <span className="text-text-default text-sm font-medium">{classSelected}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                {classes.map(val => (
                  <SelectItem key={val} value={val} className="text-text-default text-sm font-medium">
                    {val}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {tab === "Students" && (
            <Select value={statusSelected} onValueChange={setStatusSelected}>
              <SelectTrigger className="border-border-darker h-8! w-auto border">
                <SelectValue>
                  <Group fill="var(--color-icon-black-muted )" className="size-4" />
                  <span className="text-text-default text-sm font-medium">{statusSelected}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                {studentStatus.map(status => (
                  <SelectItem key={status} value={status} className="text-text-default text-sm font-medium">
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <Button className="bg-bg-state-soft block size-7 rounded-md p-1.5 md:hidden" onClick={() => setIsFilterOpen(true)}>
          <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
        </Button>

        {/* <MobileDrawer open={isFilterOpen} setIsOpen={setIsFilterOpen} title="Filter">
          <div className="flex w-full flex-col gap-4 p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar fill="var(--color-icon-black-muted)" className="size-4" />
                <Label className="text-text-default text-sm font-medium">Period</Label>
              </div>
              <Select value={termSelected} onValueChange={setTermSelected}>
                <SelectTrigger className="bg-bg-input-soft text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
                  <SelectValue>
                    <span className="text-text-default text-sm">{termSelected}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {termsOptions.map(term => (
                    <SelectItem key={term} value={term} className="text-text-default text-sm">
                      {term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
        </MobileDrawer> */}
      </div>
    </div>
  );
};
