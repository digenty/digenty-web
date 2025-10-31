"use client";
import { DataTable } from "@/components/DataTable";
import { Parent, Student } from "@/components/DataTable/types";
import { useState } from "react";
import { columns } from "./Columns";
import { parentColumns } from "../StudentAndParentRecord/Parents/ParentColumns";
import { MobileCard } from "./Students/MobileCard";
import { Button } from "../ui/button";
import { ParentsMobileCard } from "./Parents/ParentsMobileCard";

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

const parents: Parent[] = Array.from({ length: 60 }).map(() => ({
  id: Math.random().toString(36).substring(2, 9),
  name: "Damilare John",
  gender: "Male",
  phoneNumber: "0904 000 0000",
  emailAddress: "damailarejohn@gmail.com",
  branch: "Lawanson",
  tags: [{ label: "VIP Parent", color: "bg-basic-fuchsia-strong", bgColor: "bg-badge-fuchsia" }],
}));

const StudentAndParentRecord = () => {
  const [activeProfileTab, setActiveProfileTab] = useState("students");
  const [page, setPage] = useState(1);
  const pageSize = 50;

  return (
    <div className="p-4">
      <div className="mb-3 flex w-full items-center md:justify-start">
        <Button
          className={`relative max-w-[204px] cursor-pointer rounded-none px-4 py-2 text-sm font-medium transition-all duration-200 ${
            activeProfileTab === "students"
              ? "border-border-informative text-text-informative border-b-2"
              : "border-border-default hover:text-text-informative text-text-muted border-b-2"
          }`}
          onClick={() => setActiveProfileTab("students")}
        >
          Students
        </Button>
        <Button
          onClick={() => setActiveProfileTab("parents")}
          className={`relative max-w-[204px] cursor-pointer rounded-none px-4 py-2 text-sm font-medium transition-all duration-200 ${
            activeProfileTab === "parents"
              ? "border-border-informative text-text-informative border-b-2"
              : "border-border-default hover:text-text-informative text-text-muted border-b-2"
          }`}
        >
          Parents
        </Button>
      </div>

      {activeProfileTab === "students" && (
        <>
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
        </>
      )}

      {activeProfileTab === "parents" && (
        <>
          <div className="hidden md:block">
            <DataTable
              columns={parentColumns}
              data={parents}
              totalCount={parents.length}
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
            {parents.map(parent => (
              <ParentsMobileCard key={parent.id} parent={parent} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentAndParentRecord;
