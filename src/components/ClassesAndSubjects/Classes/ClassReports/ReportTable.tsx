"use client";

import React, { useState } from "react";
import { ClassReportProps } from "../types";
import { DataTable } from "@/components/DataTable";
import { ClassReportColumns } from "./Column";
import { MobileReport } from "./MobileReport";

const classReportData: ClassReportProps = {
  id: 1,
  studentName: "Damilare John",
  subject: 0,
};

const reportData: ClassReportProps[] = Array.from({ length: 12 }, (_, index) => ({
  ...classReportData,
  id: index + 1,
}));

export const ReportTable = () => {
  const [page, setPage] = useState(1);
  const [activeStudent, setActiveStudent] = useState<number>();

  return (
    <div className="px-4 py-3">
      <div className="hidden md:block">
        <DataTable
          pageSize={10}
          clickHandler={() => {}}
          rowSelection={{}}
          setRowSelection={() => {}}
          onSelectRows={() => {}}
          columns={ClassReportColumns}
          data={reportData}
          totalCount={reportData.length}
          page={page}
          setCurrentPage={setPage}
          showPagination={false}
          fullBorder
          classNames={{
            tableBodyCell: "text-center",
          }}
        />
      </div>
      <ul className="flex flex-col gap-3 pb-8 md:hidden">
        {reportData.map(student => {
          return <MobileReport key={student.id} student={student} activeStudent={activeStudent} setActiveStudent={setActiveStudent} />;
        })}
      </ul>
    </div>
  );
};
