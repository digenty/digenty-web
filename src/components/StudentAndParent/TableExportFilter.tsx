"use client";

import { Arm, Branch, ClassType, Department } from "@/api/types";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { studentsStatus } from "./constants";
import { StudentsStatus } from "./types";

export const TableExportFilter = ({
  tab,
  filter,
  onFilterChange,
  branches,
  loadingBranches,
  classes,
  loadingClasses,
  arms,
  loadingArms,
  filteredCount = 0,
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
  filteredCount?: number;
}) => {
  return (
    <div className="flex w-full flex-col gap-5 px-3 py-5 md:px-6">
      <p className="text-text-default hidden text-sm font-bold md:inline">Filter Selection</p>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-text-default text-sm font-medium">Branch</Label>
        </div>
        {!branches || loadingBranches ? (
          <Skeleton className="bg-bg-input-soft h-9 w-full" />
        ) : (
          <Select
            onValueChange={value => {
              const branch = branches.data.content?.find((branch: Branch) => branch.uuid === value);
              onFilterChange("branchSelected", branch);
            }}
          >
            <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
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
      </div>

      {tab === "Students" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-text-default text-sm font-medium">Class</Label>
          </div>
          {!classes || loadingClasses ? (
            <Skeleton className="bg-bg-input-soft h-9 w-full" />
          ) : (
            <Select
              onValueChange={value => {
                const cls = classes.data.content?.find((cls: ClassType) => cls.uuid === value);
                onFilterChange("classSelected", cls);
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
      )}

      {tab === "Students" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-text-default text-sm font-medium">Arm</Label>
          </div>
          {!arms || loadingArms ? (
            <Skeleton className="bg-bg-input-soft h-9 w-full" />
          ) : (
            <Select
              onValueChange={value => {
                const arm = arms.data.content.find((arm: Arm) => arm.uuid === value);
                onFilterChange("armSelected", arm);
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
      )}

      {tab === "Students" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-text-default text-sm font-medium">Student Status</Label>
          </div>
          <Select
            onValueChange={value => {
              const status = studentsStatus.find((status: { value: StudentsStatus; label: string }) => status.value === value);
              if (status) {
                onFilterChange("statusSelected", status);
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
      )}

      <div className="bg-bg-badge-green text-bg-basic-green-strong border-border-default w-fit rounded-md px-1 py-0.5 text-xs font-medium">
        {filteredCount} {tab === "Students" ? `Student${filteredCount > 1 ? "s" : ""}` : `Parent${filteredCount > 1 ? "s" : ""}`} Found
      </div>
    </div>
  );
};
