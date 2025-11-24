"use client";

import { useState } from "react";
import { ScoreType } from "./types";

import { DataTable } from "@/components/DataTable";
import { scoreColumns } from "././Columns";
import { MobileCard } from "./MobileCard";

export const ScoreViewBySubject = ({ scores }: { scores: ScoreType[] }) => {
  const [page, setPage] = useState(1);
  const [activeStudent, setActiveStudent] = useState<number>();

  return (
    <div>
      <div className="hidden md:block">
        <DataTable
          pageSize={10}
          clickHandler={() => {}}
          rowSelection={{}}
          setRowSelection={() => {}}
          onSelectRows={() => {}}
          columns={scoreColumns}
          data={scores}
          totalCount={scores.length}
          page={page}
          setCurrentPage={setPage}
          fullBorder
          showPagination={false}
          classNames={{
            tableBodyCell: "text-center",
          }}
        />
      </div>

      <ul className="flex flex-col gap-3 pb-8 md:hidden">
        {scores.map(student => {
          return <MobileCard key={student.id} student={student} activeStudent={activeStudent} setActiveStudent={setActiveStudent} />;
        })}
      </ul>
    </div>
  );
};
