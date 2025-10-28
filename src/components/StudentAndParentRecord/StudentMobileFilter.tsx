"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { useState } from "react";
import StudentIcon from "../Icons/StudentIcon";
import ClassIcon from "../Icons/ClassIcon";
import BookOpen from "../Icons/BookOpen";

const branches = ["All Branches", "Lawanson", "Ilasamaja"];
const classes = ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"];
const departments = ["Science", "Arts", "Commercial"];
const arms = ["A", "B", "C", "D"];
const activeStudents = ["Active Students", "Graduated Students", "Withdrawn Students"];

export default function StudentFiltersDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [branchSelected, setBranchSelected] = useState(branches[0]);
  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0]);
  const [selectedArm, setSelectedArm] = useState(arms[0]);
  const [activeStudent, setActiveStudent] = useState(activeStudents[0]);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-bg-default overflow-y:scroll w-full max-w-full rounded-t-[12px] pb-3 shadow-lg">
        <DrawerHeader className="bg-bg-state-soft border-border-default rounded-t-[12px] border-b px-[16px] py-[12px]">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-md text-text-default font-semibold">Filter</DrawerTitle>

            <button onClick={onClose} className="text-icon-default-muted">
              x
            </button>
          </div>
        </DrawerHeader>

        {/* Filter Selects */}
        <div className="mt-6 flex flex-col gap-4 px-2">
          {/* Branch */}
          <Select value={branchSelected} onValueChange={setBranchSelected}>
            <div className="flex items-center gap-2">
              <Image src="/icons/school.svg" alt="branch" width={14} height={14} />
              <p className="text-text-default text-sm font-medium">Branch</p>
            </div>
            <SelectTrigger className="bg-bg-input-soft w-full rounded-md border px-3 py-2 text-left text-sm font-semibold">
              <SelectValue placeholder="Select Branch">
                <div className="text-text-default">{branchSelected}</div>
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

          {/* Class */}
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <div className="flex items-center gap-2">
              <ClassIcon />
              <p className="text-text-default text-sm font-medium">Class</p>
            </div>

            <SelectTrigger className="bg-bg-input-soft w-full rounded-md border px-3 py-2 text-left text-sm font-semibold">
              <SelectValue placeholder="Select Class">
                <div className="text-text-default"> {selectedClass}</div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-default border-border-default">
              {classes.map(cls => (
                <SelectItem key={cls} value={cls} className="text-text-default text-sm">
                  {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Department */}
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <div className="flex items-center gap-2">
              <StudentIcon />
              <p className="text-text-default text-sm font-medium">Department</p>
            </div>

            <SelectTrigger className="bg-bg-input-soft w-full rounded-md border px-3 py-2 text-left text-sm font-semibold">
              <SelectValue placeholder="Select Department">
                <div className="text-text-default text-sm"> {selectedDepartment} </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-default border-border-default">
              {departments.map(dep => (
                <SelectItem key={dep} value={dep} className="text-text-default text-sm">
                  {dep}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Arm */}
          <Select value={selectedArm} onValueChange={setSelectedArm}>
            <div className="flex items-center gap-2">
              <BookOpen />
              <p className="text-text-default text-sm font-medium">Arm</p>
            </div>
            <SelectTrigger className="bg-bg-input-soft w-full rounded-md border px-3 py-2 text-left text-sm font-semibold">
              <SelectValue placeholder="Select Arm">
                <div className="text-text-default text-sm">{selectedArm}</div>
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

          {/* Active Students */}
          <Select value={activeStudent} onValueChange={setActiveStudent}>
            <div className="flex items-center gap-2">
              <StudentIcon />
              <div className="text-text-default text-medium"> Students Status</div>
            </div>
            <SelectTrigger className="bg-bg-input-soft w-full rounded-md border px-3 py-2 text-left text-sm font-semibold">
              <SelectValue placeholder="Active Status">
                <div className="text-text-default text-sm">{activeStudent}</div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-default border-border-default">
              {activeStudents.map(active => (
                <SelectItem key={active} value={active} className="text-text-default text-sm">
                  {active}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DrawerFooter>
          <div className="mt-[20px] flex justify-between">
            <DrawerClose asChild>
              <button onClick={onClose} className="bg-bg-state-soft text-text-default rounded-md px-4 py-2 text-sm font-semibold">
                Cancel
              </button>
            </DrawerClose>

            <button className="bg-bg-state-primary rounded-md px-4 py-2 text-sm tracking-[0.1rem] text-white">
              <span> Apply Filter</span> <span className="bg-bg-badge-white h-[5px] rounded-sm border border-white px-2 py-1">2</span>{" "}
            </button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
