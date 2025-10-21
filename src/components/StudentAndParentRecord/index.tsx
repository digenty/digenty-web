"use client";
import React, { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Student } from "@/components/DataTable/types";
import { columns } from "./Columns";

const students: Student[] = Array.from({ length: 60 }).map(() => ({
  id: Math.random().toString(36).substring(2, 9),
  name: "Damilare John",
  gender: "Male",
  class: "SS 1 Arts A",
  admissionNumber: "GFA/2023/10145",
  dob: "18/05/2007",
  branch: "Lawanson",
  tags: Math.random() > 0.5 ? [{ label: "Prefect", color: "blue" }] : [{ label: "Scholarship", color: "purple" }],
}));

// const columns: ColumnDef<Student>[] = [
//   {
//     accessorKey: "name",
//     header: "Name",
//     cell: ({ row }) => (
//       <TableCellTags name={row.original.name} tags={row.original.tags} />
//     ),
//   },
//   { accessorKey: "gender", header: "Gender" },
//   { accessorKey: "class", header: "Class" },
//   { accessorKey: "admissionNumber", header: "Admission Number" },
//   { accessorKey: "dob", header: "Date of Birth" },
//   { accessorKey: "branch", header: "Branch" },
//   {
//     id: "actions",
//     header: "",
//     cell: () => (
//       <button className="text-gray-500 hover:text-gray-700 text-lg">⋯</button>
//     ),
//   },
// ];

const StudentAndParentRecord = () => {
  const [page, setPage] = useState(1);
  const pageSize = 50;

  return (
    <div className="p-6">
      <DataTable<Student>
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
  );
};

export default StudentAndParentRecord;
