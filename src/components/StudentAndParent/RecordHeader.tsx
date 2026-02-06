"use client";

import { Arm, Branch, ClassType, Department } from "@/api/types";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

import Image from "next/image";
import { useState } from "react";
import BookOpen from "../Icons/BookOpen";
import GraduationCap from "../Icons/GraduationCap";
import Group from "../Icons/Group";
import School from "../Icons/School";
import { MobileDrawer } from "../MobileDrawer";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { studentsStatus } from "./constants";
import { StudentsStatus } from "./types";

export const RecordHeader = ({
  tab,
  filter,
  onFilterChange,
  branches,
  loadingBranches,
  classes,
  loadingClasses,
  arms,
  loadingArms,
  departments,
  loadingDepartments,
}: {
  tab: string;
  filter: {
    branchSelected?: Branch;
    classSelected?: ClassType;
    departmentSelected?: Department;
    armSelected?: Arm;
    statusSelected?: { value: StudentsStatus; label: string };
  };
  onFilterChange: (filter: string, value: Branch | ClassType | Department | Arm | { value: StudentsStatus; label: string } | undefined) => void;
  branches?: { data: { content: Branch[] } };
  loadingBranches?: boolean;
  classes?: { data: { content: ClassType[] } };
  loadingClasses?: boolean;
  arms?: { data: { content: Arm[] } };
  loadingArms?: boolean;
  departments?: { data: Department[] };
  loadingDepartments?: boolean;
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);

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
          {!branches || loadingBranches ? (
            <Skeleton className="bg-bg-input-soft h-8 w-32" />
          ) : (
            <Select
              onValueChange={value => {
                const branch = branches.data.content?.find((branch: Branch) => branch.uuid === value);
                onFilterChange("branchSelected", branch);
              }}
            >
              <SelectTrigger className="border-border-darker h-8! w-auto border">
                <Image src="/icons/school.svg" alt="branch" width={14} height={14} />
                <span className="text-text-default text-sm font-medium">{filter.branchSelected ? filter.branchSelected?.name : "All Branches"}</span>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                <SelectItem value="none" className="text-text-default text-sm font-medium">
                  All Branches
                </SelectItem>
                {branches.data.content.map((branch: Branch) => (
                  <SelectItem key={branch.id} value={branch.uuid} className="text-text-default text-sm font-medium">
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {tab === "Students" && (
            <>
              {!classes || loadingClasses ? (
                <Skeleton className="bg-bg-input-soft h-8 w-32" />
              ) : (
                <Select
                  onValueChange={value => {
                    const cls = classes.data.content?.find((cls: ClassType) => cls.uuid === value);
                    onFilterChange("classSelected", cls);
                  }}
                >
                  <SelectTrigger className="border-border-darker h-8! w-auto border">
                    <Image src="/icons/school.svg" alt="branch" width={14} height={14} />
                    <span className="text-text-default text-sm font-medium">{filter.classSelected ? filter.classSelected?.name : "All Classes"}</span>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-card border-border-default">
                    <SelectItem value="none" className="text-text-default text-sm font-medium">
                      All Classes
                    </SelectItem>
                    {classes.data.content.map((cls: ClassType) => (
                      <SelectItem key={cls.id} value={cls.uuid} className="text-text-default text-sm font-medium">
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </>
          )}

          {tab === "Students" && (
            <Select
              onValueChange={value => {
                const status = studentsStatus.find((status: { value: StudentsStatus; label: string }) => status.value === value);
                if (status) {
                  onFilterChange("statusSelected", status);
                }
              }}
            >
              <SelectTrigger className="border-border-darker h-8! w-auto border">
                <Group fill="var(--color-icon-black-muted )" className="size-4" />
                <span className="text-text-default text-sm font-medium">{filter.statusSelected ? filter.statusSelected.label : "All Students"}</span>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                <SelectItem value="none" className="text-text-default text-sm font-medium">
                  All Students
                </SelectItem>
                {studentsStatus.map(status => (
                  <SelectItem key={status.value} value={status.value} className="text-text-default text-sm font-medium">
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
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
              {!branches || loadingBranches ? (
                <Skeleton className="bg-bg-input-soft h-9 w-full" />
              ) : (
                <Select
                  onValueChange={value => {
                    const branch = branches.data.content?.find((branch: Branch) => branch.uuid === value);
                    onFilterChange("branchSelected", branch);
                    setFilterCount(prev => (!filter.branchSelected ? prev + 1 : prev));
                  }}
                >
                  <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                    <span className="text-text-default text-sm font-medium">
                      {filter.branchSelected ? filter.branchSelected?.name : "All Branches"}
                    </span>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-card border-border-default">
                    <SelectItem value="none" className="text-text-default text-sm font-medium">
                      All Branches
                    </SelectItem>
                    {branches.data.content.map((branch: Branch) => (
                      <SelectItem key={branch.id} value={branch.uuid} className="text-text-default text-sm font-medium">
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <GraduationCap fill="var(--color-icon-black-muted)" className="size-4" />
                <Label className="text-text-default text-sm font-medium">Class</Label>
              </div>
              {!classes || loadingClasses ? (
                <Skeleton className="bg-bg-input-soft h-9 w-full" />
              ) : (
                <Select
                  onValueChange={value => {
                    const cls = classes.data.content?.find((cls: ClassType) => cls.uuid === value);
                    onFilterChange("classSelected", cls);
                    setFilterCount(prev => (!filter.classSelected ? prev + 1 : prev));
                  }}
                >
                  <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                    <span className="text-text-default text-sm font-medium">{filter.classSelected ? filter.classSelected?.name : "All Classes"}</span>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-card border-border-default">
                    <SelectItem value="none" className="text-text-default text-sm font-medium">
                      All Classes
                    </SelectItem>
                    {classes.data.content.map((cls: ClassType) => (
                      <SelectItem key={cls.id} value={cls.uuid} className="text-text-default text-sm font-medium">
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Group fill="var(--color-icon-black-muted)" className="size-4" />
                <Label className="text-text-default text-sm font-medium">Department</Label>
              </div>
              {!departments || loadingDepartments ? (
                <Skeleton className="bg-bg-input-soft h-9 w-full" />
              ) : (
                <Select
                  onValueChange={value => {
                    const department = departments.data.find((dept: Department) => dept.uuid === value);
                    onFilterChange("departmentSelected", department);
                    setFilterCount(prev => (!filter.departmentSelected ? prev + 1 : prev));
                  }}
                >
                  <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                    <span className="text-text-default text-sm">
                      {filter.departmentSelected ? filter.departmentSelected?.name : "All Departments"}
                    </span>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-default border-border-default">
                    <SelectItem value="none" className="text-text-default text-sm font-medium">
                      All Departments
                    </SelectItem>
                    {departments.data.map((dept: Department) => (
                      <SelectItem key={dept.id} value={dept.uuid} className="text-text-default text-sm">
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen fill="var(--color-icon-black-muted)" className="size-4" />
                <Label className="text-text-default text-sm font-medium">Arm</Label>
              </div>
              {!arms || loadingArms ? (
                <Skeleton className="bg-bg-input-soft h-9 w-full" />
              ) : (
                <Select
                  onValueChange={value => {
                    const arm = arms.data.content.find((arm: Arm) => arm.uuid === value);
                    onFilterChange("armSelected", arm);
                    setFilterCount(prev => (!filter.armSelected ? prev + 1 : prev));
                  }}
                >
                  <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                    <span className="text-text-default text-sm">{filter.armSelected ? filter.armSelected?.name : "Select Arm"}</span>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-default border-border-default">
                    {arms.data.content.length === 0 && <SelectItem value="none">No Arms for the selected class</SelectItem>}
                    {arms.data.content.map((arm: Arm) => (
                      <SelectItem key={arm.id} value={arm.uuid} className="text-text-default text-sm">
                        {arm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Group fill="var(--color-icon-black-muted)" className="size-4" />
                <Label className="text-text-default text-sm font-medium">Student Status</Label>
              </div>
              <Select
                onValueChange={value => {
                  const status = studentsStatus.find((status: { value: StudentsStatus; label: string }) => status.value === value);
                  if (status) {
                    onFilterChange("statusSelected", status);
                    setFilterCount(prev => (!filter.statusSelected ? prev + 1 : prev));
                  }
                }}
              >
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <span className="text-text-default text-sm">{filter.statusSelected ? filter.statusSelected.label : "All Students"}</span>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  <SelectItem value="none" className="text-text-default text-sm font-medium">
                    All Students
                  </SelectItem>
                  {studentsStatus.map(status => (
                    <SelectItem key={status.value} value={status.value} className="text-text-default text-sm">
                      {status.label}
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

              <Button
                onClick={() => setIsFilterOpen(false)}
                className="bg-bg-state-primary text-text-white-default rounded-md! px-4 py-2 text-sm tracking-[0.1rem]"
              >
                <span>Apply Filter</span>
                <span className="bg-bg-badge-white border-border-white rounded-sm px-1.5 py-0.5 text-xs">{filterCount}</span>
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      </div>
    </div>
  );
};
