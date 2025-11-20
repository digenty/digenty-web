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

export const TermSheet = () => {
  const path = usePathname();
  const classGroup = path.split("/")[2] ?? "";
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<StudentAttendance[]>([]);
  const [activeWeek, setActiveWeek] = useState(students[0].weeks[0].week);
  console.log(selectedRows);
  const pageSize = 10;

  return (
    <div className="space-y-6">
      <TermSheetHeader classname={classGroup.replace("-", " ")} termWeeks={students[0].weeks} activeWeek={activeWeek} setActiveWeek={setActiveWeek} />

      <div className="hidden px-4 md:block md:px-8">
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

      <div className="block md:hidden">mobile</div>
    </div>
  );
};
