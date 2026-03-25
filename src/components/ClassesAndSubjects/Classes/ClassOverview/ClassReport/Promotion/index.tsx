import { CumulativeReport, PromotionBySubjectReport, PromotionBySubjectStudent, ResultSettings } from "@/api/types";
import { DataTable } from "@/components/DataTable";
import { UserSetting } from "@/components/Icons/UserSetting";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { useGetRequiredSubjectReport, useSetPromotionDecision } from "@/hooks/queryHooks/class";
import { useGetAcademic } from "@/hooks/queryHooks/useAcademic";
import { useMemo, useState } from "react";
import { PromotionStudent } from "../students";
import { createPromotionColumns, createSubjectCombinationColumns } from "./PromotionColumn";
import { PromotionDecisionModal } from "./PromotionDecisionModal";

export const Promotion = ({
  cumulativeReport,
  armId,
  resultSettings,
}: {
  cumulativeReport: CumulativeReport;
  armId: number;
  resultSettings: ResultSettings;
}) => {
  const promotionType = resultSettings?.promotionType;
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<PromotionStudent[]>([]);
  const [decisions, setDecisions] = useState<
    {
      status: string;
      studentId: number;
      toClassId?: number;
      toArmId?: number;
      className?: string;
      armName?: string;
    }[]
  >([]);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [individualStudent, setIndividualStudent] = useState<PromotionStudent | null>(null);
  const [classToPromoteTo, setClassToPromoteTo] = useState<string>("");
  const [armToPromoteTo, setArmToPromoteTo] = useState<string>("");
  const pageSize = 100;

  const { data: academic } = useGetAcademic();
  const sessionId = academic?.data?.id || 0;

  const { mutate: setDecision, isPending: isSaving } = useSetPromotionDecision();

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

  const handleSaveDecision = (decisionData: { status: string; studentId: number; toClassId?: number; toArmId?: number }) => {
    const payload = {
      armId: armId,
      sessionId: sessionId,
      decisions,
    };

    setDecision(payload, {
      onSuccess: () => {
        toast({ title: "Success", description: "Promotions saved successfully", type: "success" });
        setShowDecisionModal(false);
        setRowSelection({});
        setSelectedRows([]);
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to save promotions", type: "error" });
      },
    });
  };

  return (
    <div>
      {selectedRows.length > 0 && (
        <div className="mb-4 hidden items-center gap-1 md:flex">
          <div className="bg-bg-state-soft text-text-default flex h-7 items-center justify-center gap-1 rounded-md px-2.5 text-sm font-medium">
            <span> {selectedRows.length}</span>
            <span>Selected Student{selectedRows.length !== 1 && "s"}</span>
          </div>

          {isSubjectCombination && (
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

          {(promotionType === "MANUAL" || promotionType === "BY_PERFORMANCE") && (
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
          isLoading={isSaving}
          setClassToPromoteTo={setClassToPromoteTo}
          setArmToPromoteTo={setArmToPromoteTo}
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
          }}
        />
      )}
    </div>
  );
};
