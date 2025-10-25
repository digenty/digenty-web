"use client";
import { DataTable } from "@/components/DataTable";
import { Student } from "@/components/DataTable/types";
import { cn } from "@/lib/utils";
import { MoreHorizontal, PlusIcon } from "lucide-react";
import { useState } from "react";
import GraduationCap from "../Icons/GraduationCap";
import Import from "../Icons/Import";
import ShareBox from "../Icons/ShareBox";
import UserFill from "../Icons/UserFill";
import UserMinus from "../Icons/UserMinus";
import { OverviewCard } from "../OverviewCard";
import { SearchInput } from "../SearchInput";
import { Button } from "../ui/button";
import { columns } from "./Columns";
import { MobileCard } from "./MobileCard";
import { RecordHeader } from "./RecordHeader";

const students: Student[] = Array.from({ length: 60 }).map(() => ({
  id: Math.random().toString(36).substring(2, 9),
  name: "Damilare John",
  gender: "Male",
  class: "SS 1 Arts A",
  admissionNumber: "GFA/2023/10145",
  dob: "18/05/2007",
  branch: "Lawanson",
  tags: [{ label: "Prefect", color: "bg-basic-cyan-strong", bgColor: "bg-badge-cyan" }],
}));

const tabs = ["Students", "Parents"];

const StudentAndParentRecord = () => {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const pageSize = 50;

  return (
    <div className="space-y-6 px-4 py-6 md:space-y-8 md:px-8">
      <div className="border-border-default flex w-auto max-w-105 items-center gap-3 border-b">
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          return (
            <div
              role="button"
              onClick={() => setActiveTab(tab)}
              key={tab}
              className={cn("w-1/2 cursor-pointer py-2.5 text-center", isActive && "border-border-informative border-b-[1.5px]")}
            >
              <span className={cn("text-sm font-medium", isActive ? "text-text-informative" : "text-text-muted")}>{tab}</span>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        <RecordHeader tab={activeTab} />

        <div className={cn(activeTab === "Parents" && "border-border-default border-b")} />

        {activeTab === "Students" && (
          <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            <OverviewCard
              title="Total Students"
              Icon={() => (
                <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
                  <UserFill fill="var(--color-icon-default)" className="size-[10px]" />
                </div>
              )}
              value="583"
            />
            <OverviewCard
              title="Active Students"
              Icon={() => (
                <div className="bg-bg-basic-emerald-subtle border-bg-basic-emerald-accent flex w-6 items-center justify-center rounded-xs border p-1">
                  <UserFill fill="var(--color-icon-default)" className="size-[10px]" />
                </div>
              )}
              value="580"
            />
            <OverviewCard
              title="Withdrawn Students"
              Icon={() => (
                <div className="bg-bg-basic-yellow-subtle border-bg-basic-yellow-accent flex w-6 items-center justify-center rounded-xs border p-1">
                  <UserMinus fill="var(--color-icon-default)" className="size-[10px]" />
                </div>
              )}
              value="3"
            />

            <OverviewCard
              title="Graduated Students"
              Icon={() => (
                <div className="bg-bg-basic-sky-subtle border-bg-basic-sky-accent flex w-6 items-center justify-center rounded-xs border p-1">
                  <GraduationCap fill="var(--color-icon-default)" className="size-[10px]" />
                </div>
              )}
              value="100"
            />
          </div>
        )}

        <div className="mt-6 flex flex-col justify-between gap-3 md:mt-8 md:flex-row md:items-center">
          <SearchInput className="border-border-default bg-bg-input-soft h-8 rounded-lg border md:w-70.5" />

          <div className="flex items-center gap-1">
            <Button className="bg-bg-state-secondary border-border-darker shadow-light hidden h-8 gap-2 rounded-md border px-[14px]! md:flex">
              <ShareBox fill="var(--color-icon-default-muted)" className="size-[15px]" />
              <span className="text-text-default font-medium">Export</span>
            </Button>

            <Button className="bg-bg-state-secondary border-border-darker shadow-light hidden h-8 gap-2 rounded-md border px-[14px]! md:flex">
              <Import fill="var(--color-icon-default-muted)" className="size-[15px]" />
              <span className="text-text-default font-medium">Import</span>
            </Button>

            <Button className="bg-bg-state-primary hover:bg-bg-state-primary-hover! shadow-xlight h-8 gap-2 rounded-md px-[14px]!">
              <PlusIcon className="text-icon-white-default size-4" />
              <span className="text-text-white-default font-medium">Add Student</span>
            </Button>

            <Button className="bg-bg-state-soft flex h-8 rounded-md px-2! md:hidden">
              <MoreHorizontal className="text-icon-default-subtle size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={students}
          totalCount={students.length}
          page={page}
          setCurrentPage={setPage}
          pageSize={pageSize}
          clickHandler={row => {
            // setIsDetailsOpen(true);
            // setSelectedRole(row.original);
          }}
        />
      </div>

      <div className="flex flex-col gap-4 pb-16 md:hidden">
        {students.map(student => (
          <MobileCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
};

export default StudentAndParentRecord;
