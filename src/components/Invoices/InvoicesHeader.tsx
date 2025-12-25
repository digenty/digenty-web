"use client";

import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { useState } from "react";
import BookOpen from "../Icons/BookOpen";
import GraduationCap from "../Icons/GraduationCap";
import Group from "../Icons/Group";
import School from "../Icons/School";
import { MobileDrawer } from "../MobileDrawer";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import Calendar from "../Icons/Calendar";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const branches = ["All Branches", "Lawanson", "Ilasamaja"];
const classes = ["JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3"];
const termsOptions = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];

const departments = ["All Departments", "Art", "Commercial", "Science"];
const arms = ["All Arms", "A", "B", "C"];

export const InvoicesHeader = () => {
  const [branchSelected, setBranchSelected] = useState(branches[0]);
  const [classSelected, setClassSelected] = useState(classes[0]);
  const [termSelected, setTermSelected] = useState(termsOptions[0]);
  const [departmentSelected, setDepartmentSelected] = useState(departments[0]);
  const [armSelected, setArmSelected] = useState(arms[0]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useBreadcrumb([{ label: "Invoices", url: "/invoices" }]);

  return (
    <div>
      <div className="flex w-full justify-between align-middle">
        <h2 className="text-text-default text-xl font-semibold">Overview</h2>
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

          <Select value={termSelected} onValueChange={setTermSelected}>
            <SelectTrigger className="border-border-darker h-8! w-auto border">
              <SelectValue>
                <Calendar fill="var(--color-icon-black-muted)" className="size-4" />
                <span className="text-text-default text-sm font-medium">{termSelected}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default">
              {termsOptions.map(status => (
                <SelectItem key={status} value={status} className="text-text-default text-sm font-medium">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button className="bg-bg-state-soft block size-7 rounded-md p-1.5 md:hidden" onClick={() => setIsFilterOpen(true)}>
          <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
        </Button>

        <MobileDrawer open={isFilterOpen} setIsOpen={setIsFilterOpen} title="Filter">
          <div className="flex w-full flex-col gap-4 px-3 py-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <School fill="var(--color-icon-black-muted)" className="size-4" />
                <Label className="text-text-default text-sm font-medium">Branch</Label>
              </div>
              <Select value={branchSelected} onValueChange={setBranchSelected}>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
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
                <GraduationCap fill="var(--color-icon-black-muted)" className="size-4" />
                <Label className="text-text-default text-sm font-medium">Class</Label>
              </div>
              <Select value={classSelected} onValueChange={setClassSelected}>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <SelectValue>
                    <span className="text-text-default text-sm">{classSelected}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {classes.map(value => (
                    <SelectItem key={value} value={value} className="text-text-default text-sm">
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Group fill="var(--color-icon-black-muted)" className="size-4" />
                <Label className="text-text-default text-sm font-medium">Department</Label>
              </div>
              <Select value={departmentSelected} onValueChange={setDepartmentSelected}>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <SelectValue>
                    <span className="text-text-default text-sm">{departmentSelected}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept} className="text-text-default text-sm">
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen fill="var(--color-icon-black-muted)" className="size-4" />
                <Label className="text-text-default text-sm font-medium">Arm</Label>
              </div>
              <Select value={armSelected} onValueChange={setArmSelected}>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <SelectValue>
                    <span className="text-text-default text-sm">{classSelected}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {arms.map(arm => (
                    <SelectItem key={arm} value={arm} className="text-text-default text-sm">
                      {arm}
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
              <Select value={termSelected} onValueChange={setTermSelected}>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <SelectValue>
                    <span className="text-text-default text-sm">{termSelected}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {termsOptions.map(status => (
                    <SelectItem key={status} value={status} className="text-text-default text-sm">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar fill="var(--color-icon-black-muted)" className="size-4" />
                <Label className="text-text-default text-sm font-medium">Date Range</Label>
              </div>
              <Select value={termSelected} onValueChange={setTermSelected}>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <SelectValue>
                    <span className="text-text-default text-sm">{termSelected}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {termsOptions.map(status => (
                    <SelectItem key={status} value={status} className="text-text-default text-sm">
                      {status}
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
        </MobileDrawer>
      </div>
    </div>
  );
};
