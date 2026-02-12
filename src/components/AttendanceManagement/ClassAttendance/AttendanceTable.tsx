import { useState } from "react";
import { columns } from "./AttendanceColumns";
import { DataTable } from "@/components/DataTable";

export interface Student {
  id: number;
  name: string;
  avatar: string;
  present: boolean;
}

const students: Student[] = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  name: "Damilare John",
  avatar: "/avatar.png", // your static image
  present: i === 1 ? false : true, // just to test ✓ and ✕
}));

export const AttendanceTable = () => {
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<Student[]>([]);
  const pageSize = 10;

  return (
    <div className="px-4 pb-10 md:px-8">
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
        showPagination={false}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        onSelectRows={setSelectedRows}
        fullBorder
      />
    </div>
  );
};
