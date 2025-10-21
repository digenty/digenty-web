"use client";
import { DataTable } from "@/components/DataTable";
import { Student } from "@/components/DataTable/types";
import { useState } from "react";
import { columns } from "./Columns";
import { MobileCard } from "./MobileCard";

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

const StudentAndParentRecord = () => {
  const [page, setPage] = useState(1);
  const pageSize = 50;

  return (
    <div className="p-4">
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
