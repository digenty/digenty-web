"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import BookOpen from "../Icons/BookOpen";
import GraduationCap from "../Icons/GraduationCap";
import Group from "../Icons/Group";
import School from "../Icons/School";
import { Label } from "../ui/label";

const branches = ["All Branches", "Lawanson", "Ilasamaja"];
const classes = ["JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3"];
const studentStatus = ["Active Students", "Graduated Students", "Withdrawn Students"];
const departments = ["All Departments", "Art", "Commercial", "Science"];
const arms = ["All Arms", "A", "B", "C"];

export const TableExportFilter = () => {
  const [branchSelected, setBranchSelected] = useState(branches[0]);
  const [classSelected, setClassSelected] = useState(classes[0]);
  const [statusSelected, setStatusSelected] = useState(studentStatus[0]);
  const [departmentSelected, setDepartmentSelected] = useState(departments[0]);
  const [armSelected, setArmSelected] = useState(arms[0]);

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
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
          <Label className="text-text-default text-sm font-medium">Status</Label>
        </div>
        <Select value={statusSelected} onValueChange={setStatusSelected}>
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
            <SelectValue>
              <span className="text-text-default text-sm">{statusSelected}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-default border-border-default">
            {studentStatus.map(status => (
              <SelectItem key={status} value={status} className="text-text-default text-sm">
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-bg-badge-green text-bg-basic-green-strong border-border-default w-fit rounded-md px-1 py-0.5 text-xs font-medium">
        20 students found
      </div>
    </div>
  );
};
