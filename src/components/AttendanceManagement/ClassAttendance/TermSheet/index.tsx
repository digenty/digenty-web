"use client";
import { DataTable } from "@/components/DataTable";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { TermSheetCard } from "./TermSheetCard";
import { generateColumns } from "./TermSheetColumns";
import { TermSheetHeader } from "./TermSheetHeader";
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
  const [activeStudent, setActiveStudent] = useState<string>();
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
          classNames={{
            tableWrapper: "overflow-auto",
          }}
        />
      </div>

      <div className="block space-y-3 px-4 md:hidden">
        {students.map((student: StudentAttendance) => {
          const days = student.weeks.find(wk => wk.week === activeWeek)?.days;
          return <TermSheetCard key={student.id} student={student} days={days} activeStudent={activeStudent} setActiveStudent={setActiveStudent} />;
        })}
      </div>
    </div>
  );
};
