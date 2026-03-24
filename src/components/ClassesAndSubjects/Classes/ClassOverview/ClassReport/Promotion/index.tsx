import { CumulativeReport } from "@/api/types";
import { DataTable } from "@/components/DataTable";
import { useState } from "react";
import { createPromotionColumns } from "./PromotionColumn";
import { PromotionStudent } from "../students";
import { Button } from "@/components/ui/button";
import { UserSetting } from "@/components/Icons/UserSetting";

export const Promotion = ({ cumulativeReport }: { cumulativeReport: CumulativeReport }) => {
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<PromotionStudent[]>([]);
  const pageSize = 100;

  return (
    <div>
      {selectedRows.length > 0 && (
        <div className="mb-4 hidden items-center gap-1 md:flex">
          <div className="bg-bg-state-soft text-text-default flex h-7 items-center justify-center gap-1 rounded-md px-2.5 text-sm font-medium">
            <span> {selectedRows.length}</span>
            <span>Selected Student{selectedRows.length !== 1 && "s"}</span>
          </div>

          <Button className="bg-bg-state-secondary border-border-darker text-text-default h-7 border px-2.5 text-sm font-medium">
            <UserSetting fill="var(--color-icon-default-subtle)" />
            <span>Set Decision</span>
          </Button>
        </div>
      )}

      <DataTable
        columns={createPromotionColumns(cumulativeReport?.studentCumulative || [])}
        data={cumulativeReport?.studentCumulative || []}
        totalCount={cumulativeReport?.studentCumulative?.length || 0}
        page={page}
        setCurrentPage={setPage}
        pageSize={pageSize}
        showPagination={false}
        fullBorder
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        onSelectRows={setSelectedRows}
        classNames={{
          tableHeadCell: "text-center pr-2 w-34",
          tableBodyCell: "text-center pr-2 w-34",
          tableRow: "h-14",
          table: "table-fixed",
        }}
      />
    </div>
  );
};
