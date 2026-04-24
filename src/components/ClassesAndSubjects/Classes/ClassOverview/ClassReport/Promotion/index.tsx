import { CumulativeReport, PromotionBySubjectReport, PromotionBySubjectStudent, ResultSettings } from "@/api/types";
import { DataTable } from "@/components/DataTable";
import { UserSetting } from "@/components/Icons/UserSetting";
import { Button } from "@/components/ui/button";
import { useGetRequiredSubjectReport } from "@/hooks/queryHooks/useClass";
import { useGetActiveSession } from "@/hooks/queryHooks/useAcademic";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Decision } from "..";
import { PromotionStudent } from "../students";
import { createPromotionColumns, createSubjectCombinationColumns } from "./PromotionColumn";
import { PromotionDecisionModal } from "./PromotionDecisionModal";

export const Promotion = ({
  cumulativeReport,
  armId,
  resultSettings,
  decisions,
  setDecisions,
}: {
  cumulativeReport: CumulativeReport;
  armId: number;
  resultSettings: ResultSettings;
  decisions: Decision[];
  setDecisions: Dispatch<SetStateAction<Decision[]>>;
}) => {
  const promotionType = resultSettings?.promotionType;
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<PromotionStudent[]>([]);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [individualStudent, setIndividualStudent] = useState<PromotionStudent | null>(null);
  const pageSize = 100;

  const { data: academic } = useGetActiveSession();

  const isSubjectCombination = resultSettings?.promotionType === "BY_PERFORMANCE" && resultSettings?.requiredSubjectIds?.length > 0;
  const { data: subjectReportData, isLoading: isLoadingSubjectReport } = useGetRequiredSubjectReport(armId, isSubjectCombination);

  const subjectReport = subjectReportData?.data;

  const subjectNames = useMemo(() => {
    if (!subjectReport?.students?.[0]?.subjects) return [];
    return subjectReport.students[0].subjects.map((subject: PromotionBySubjectStudent) => subject.subjectName);
  }, [subjectReport]);

  const tableData = isSubjectCombination ? subjectReport?.students || [] : cumulativeReport?.studentCumulative || [];

  const subjectCombinationColumns = createSubjectCombinationColumns(
    subjectNames,
    (student: PromotionBySubjectReport) => {
      setIndividualStudent(student);
      setShowDecisionModal(true);
    },
    decisions,
    promotionType,
    resultSettings?.minimumOverallPercentage,
  );

  const promotionColumns = createPromotionColumns(
    cumulativeReport?.studentCumulative || [],
    (student: PromotionStudent) => {
      setIndividualStudent(student);
      setShowDecisionModal(true);
    },
    decisions,
    promotionType,
    resultSettings?.minimumOverallPercentage,
  );

  return (
    <div>
      {selectedRows.length > 0 && (
        <div className="mb-4 hidden items-center gap-1 md:flex">
          <div className="bg-bg-state-soft text-text-default flex h-7 items-center justify-center gap-1 rounded-md px-2.5 text-sm font-medium">
            <span> {selectedRows.length}</span>
            <span>Selected Student{selectedRows.length !== 1 && "s"}</span>
          </div>

          {/* {isSubjectCombination && (
            <Button
              className="bg-bg-state-secondary border-border-darker text-text-default h-7 border px-2.5 text-sm font-medium"
              onClick={() => {
                setIndividualStudent(null);
                setShowDecisionModal(true);
              }}
            >
              <UserSetting fill="var(--color-icon-default-subtle)" />
              <span>Set Decision</span>
            </Button>
          )} */}

          {(isSubjectCombination || promotionType === "MANUAL" || promotionType === "BY_PERFORMANCE") && (
            <Button
              className="bg-bg-state-secondary border-border-darker text-text-default h-7 border px-2.5 text-sm font-medium"
              onClick={() => {
                setIndividualStudent(null);
                setShowDecisionModal(true);
              }}
            >
              <UserSetting fill="var(--color-icon-default-subtle)" />
              <span>Set Decision</span>
            </Button>
          )}

          {promotionType === "PROMOTE_ALL" && (
            <Button
              className="bg-bg-state-secondary border-border-darker text-text-default h-7 border px-2.5 text-sm font-medium"
              onClick={() => {
                setIndividualStudent(null);
                setShowDecisionModal(true);
              }}
            >
              <UserSetting fill="var(--color-icon-default-subtle)" />
              <span>Next Class</span>
            </Button>
          )}
        </div>
      )}

      {showDecisionModal && (
        <PromotionDecisionModal
          open={showDecisionModal}
          onOpenChange={open => {
            setShowDecisionModal(open);
            if (!open) setIndividualStudent(null);
          }}
          selectedStudents={individualStudent ? [individualStudent] : selectedRows}
          setDecisions={newDecisions => {
            setDecisions(prev => {
              const updated = [...prev];
              newDecisions.forEach(nd => {
                const index = updated.findIndex(u => u.studentId === nd.studentId);
                if (index !== -1) {
                  updated[index] = nd;
                } else {
                  updated.push(nd);
                }
              });
              return updated;
            });
          }}
          promotionType={resultSettings?.promotionType}
        />
      )}

      {isSubjectCombination ? (
        <DataTable
          columns={subjectCombinationColumns}
          data={tableData}
          totalCount={tableData.length}
          page={page}
          setCurrentPage={setPage}
          pageSize={pageSize}
          showPagination={false}
          fullBorder
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onSelectRows={setSelectedRows}
          loadingContent={isLoadingSubjectReport && isSubjectCombination}
          classNames={{
            tableHeadCell: "text-center pr-2 w-34",
            tableBodyCell: "text-center pr-2 w-34",
            tableRow: "h-14",
            table: "table-fixed",
            tableWrapper: "w-screen pr-20",
          }}
        />
      ) : (
        <DataTable
          columns={promotionColumns}
          data={tableData}
          totalCount={tableData.length}
          page={page}
          setCurrentPage={setPage}
          pageSize={pageSize}
          showPagination={false}
          fullBorder
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onSelectRows={setSelectedRows}
          loadingContent={isLoadingSubjectReport && isSubjectCombination}
          classNames={{
            tableHeadCell: "text-center pr-2 w-34",
            tableBodyCell: "text-center pr-2 w-34",
            tableRow: "h-14",
            table: "table-fixed",
            tableWrapper: "w-screen pr-20",
          }}
        />
      )}
    </div>
  );
};
