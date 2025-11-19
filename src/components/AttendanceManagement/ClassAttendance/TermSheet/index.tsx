"use client";
import { usePathname } from "next/navigation";
import { TermSheetHeader } from "./TermSheetHeader";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { generateColumns } from "./TermSheetColumns";
import { StudentAttendance, students } from "./students";

export interface Student {
  id: number;
  name: string;
  avatar: string;
  present: boolean;
}

// const students: Student[] = Array.from({ length: 15 }).map((_, i) => ({
//   id: i + 1,
//   name: "Damilare John",
//   avatar: "/avatar.png", // your static image
//   present: i === 1 ? false : true, // just to test ✓ and ✕
// }));

export const TermSheet = () => {
  const path = usePathname();
  const classGroup = path.split("/")[2] ?? "";
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<StudentAttendance[]>([]);
  console.log(selectedRows);
  const pageSize = 10;

  return (
    <div className="space-y-6">
      <TermSheetHeader classname={classGroup.replace("-", " ")} />

      <div className="">
        <DataTable
          columns={generateColumns(students[0].weeks)}
          data={students}
          totalCount={students.length}
          page={page}
          setCurrentPage={setPage}
          pageSize={pageSize}
          clickHandler={row => {
            console.log(row);
            // setIsDetailsOpen(true);
            // setSelectedRole(row.original);
          }}
          showPagination={false}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onSelectRows={setSelectedRows}
          fullBorder
        />
      </div>
    </div>
  );
};
