import { StudentAttendance } from "@/api/types";
import { DataTable } from "@/components/DataTable";
import { useState } from "react";
import { getColumns } from "./AttendanceColumns";
import type { SessionSlot } from ".";

export const AttendanceTable = ({ roster, slots }: { roster: StudentAttendance[]; slots: SessionSlot[] }) => {
  const [page, setPage] = useState(1);

  const columns = getColumns(slots);

  const pageSize = 10;

  return (
    <div className="">
      <DataTable
        columns={columns}
        data={roster}
        totalCount={roster.length}
        page={page}
        setCurrentPage={setPage}
        pageSize={pageSize}
        showPagination={false}
        fullBorder
      />
    </div>
  );
};
