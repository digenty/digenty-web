import { StudentAttendance } from "@/api/types";
import { DataTable } from "@/components/DataTable";
import { useState } from "react";
import { getColumns } from "./AttendanceColumns";

export const AttendanceTable = ({
  students,
  setAttendanceList,
  attendanceList,
}: {
  students: StudentAttendance[];
  setAttendanceList: React.Dispatch<React.SetStateAction<{ studentId: number; isPresent: boolean }[]>>;
  attendanceList: { studentId: number; isPresent: boolean }[];
}) => {
  const [page, setPage] = useState(1);

  const handleToggleAttendance = (studentId: number, isPresent: boolean) => {
    setAttendanceList(prev => {
      const existingStudent = prev.find(student => student.studentId === studentId);

      if (existingStudent) {
        return prev.map(student => (student.studentId === studentId ? { ...student, isPresent } : student));
      }

      return [...prev, { studentId, isPresent }];
    });
  };

  const columns = getColumns(attendanceList, handleToggleAttendance);

  const pageSize = 10;

  return (
    <div className="">
      <DataTable
        columns={columns}
        data={students}
        totalCount={students.length}
        page={page}
        setCurrentPage={setPage}
        pageSize={pageSize}
        showPagination={false}
        fullBorder
      />
    </div>
  );
};
