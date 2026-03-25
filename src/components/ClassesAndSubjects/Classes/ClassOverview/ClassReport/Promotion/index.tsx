import { CumulativeReport } from "@/api/types";
import { DataTable } from "@/components/DataTable";
import { useState } from "react";
import { createPromotionColumns, createSubjectCombinationColumns } from "./PromotionColumn";
import { PromotionStudent } from "../students";
import { Button } from "@/components/ui/button";
import { UserSetting } from "@/components/Icons/UserSetting";
import { PromotionDecisionModal } from "./PromotionDecisionModal";
import { useGetAcademic } from "@/hooks/queryHooks/useAcademic";
import { useGetRequiredSubjectReport, useSetPromotionDecision } from "@/hooks/queryHooks/class";
import { toast } from "@/components/Toast";
import { useMemo } from "react";
import { PromotionBySubjectReport, PromotionBySubjectReportResponse } from "@/api/types";

export const samplePromotionBySubjectReportResponse: PromotionBySubjectReportResponse = {
  levelId: 3,
  students: [
    {
      studentId: 101,
      studentName: "Adebayo Tunde",
      subjects: [
        { subjectId: 1, subjectName: "Mathematics", score: 78 },
        { subjectId: 2, subjectName: "English", score: 72 },
        { subjectId: 3, subjectName: "Basic Science", score: 69 },
        { subjectId: 4, subjectName: "Social Studies", score: 74 },
        { subjectId: 5, subjectName: "Computer Studies", score: 81 }
      ],
      total: 374,
      percentage: 74.8
    },
    {
      studentId: 102,
      studentName: "Chinonso Okafor",
      subjects: [
        { subjectId: 1, subjectName: "Mathematics", score: 55 },
        { subjectId: 2, subjectName: "English", score: 61 },
        { subjectId: 3, subjectName: "Basic Science", score: 58 },
        { subjectId: 4, subjectName: "Social Studies", score: 64 },
        { subjectId: 5, subjectName: "Computer Studies", score: 60 }
      ],
      total: 298,
      percentage: 59.6
    },
    {
      studentId: 103,
      studentName: "Fatima Bello",
      subjects: [
        { subjectId: 1, subjectName: "Mathematics", score: 38 },
        { subjectId: 2, subjectName: "English", score: 42 },
        { subjectId: 3, subjectName: "Basic Science", score: 40 },
        { subjectId: 4, subjectName: "Social Studies", score: 36 },
        { subjectId: 5, subjectName: "Computer Studies", score: 45 }
      ],
      total: 201,
      percentage: 40.2
    }
  ],
  stats: {
    promoted: 2,
    repeated: 1,
    pending: 0
  }
};

export const Promotion = ({ cumulativeReport, armId, promotionType = "SUBJECT_COMBINATION" }: { cumulativeReport: CumulativeReport, armId: number, promotionType?: string }) => {
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<PromotionStudent[]>([]);
  const [decisions, setDecisions] = useState<{ 
    status: string; 
    studentId: number; 
    toClassId?: number; 
    toArmId?: number;
    className?: string;
    armName?: string;
  }[]>([]);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [individualStudent, setIndividualStudent] = useState<PromotionStudent | null>(null);
  const [classToPromoteTo, setClassToPromoteTo] = useState<string>("");
  const [armToPromoteTo, setArmToPromoteTo] = useState<string>("");
  const pageSize = 100;

  const { data: academic } = useGetAcademic();
  const sessionId = academic?.data?.id || 0;

  const { mutate: setDecision, isPending: isSaving } = useSetPromotionDecision();
  
  const isSubjectCombination = promotionType === "SUBJECT_COMBINATION";

  const { data: subjectReportData, isLoading: isLoadingSubjectReport } = useGetRequiredSubjectReport(armId, isSubjectCombination);
  
  // Use mock data for SUBJECT_COMBINATION as requested
  const subjectReport = isSubjectCombination ? samplePromotionBySubjectReportResponse : subjectReportData?.data;

  const subjectNames = useMemo(() => {
    if (!subjectReport?.students?.[0]?.subjects) return [];
    return subjectReport.students[0].subjects.map((s: any) => s.subjectName);
  }, [subjectReport]);

  const tableData = isSubjectCombination 
    ? subjectReport?.students || [] 
    : cumulativeReport?.studentCumulative || [];

  const columns = useMemo(() => {
    if (isSubjectCombination) {
      return createSubjectCombinationColumns(
        subjectNames,
        (student: PromotionBySubjectReport) => {
          setIndividualStudent(student as any);
          setShowDecisionModal(true);
        },
        decisions,
        promotionType
      );
    }
    return createPromotionColumns(
      cumulativeReport?.studentCumulative || [],
      (student: PromotionStudent) => {
        setIndividualStudent(student);
        setShowDecisionModal(true);
      },
      decisions,
      promotionType
    );
  }, [promotionType, isSubjectCombination, subjectNames, decisions, cumulativeReport]);

  console.log(decisions)

  const handleSaveDecision = (decisionData: { status: string; studentId: number; toClassId?: number; toArmId?: number }) => {
    console.log(decisionData)
    // if (!sessionId) {
    //   toast({ title: "Error", description: "Academic session not found", type: "error" });
    //   return;
    // }

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
          onOpenChange={(open) => {
            setShowDecisionModal(open);
            if (!open) setIndividualStudent(null);
          }}
          selectedStudents={individualStudent ? [individualStudent] : selectedRows}
          setDecisions={(newDecisions) => {
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
          promotionType={promotionType}
        />
      )}

      <DataTable
        columns={columns as any}
        data={tableData}
        totalCount={tableData.length}
        page={page}
        setCurrentPage={setPage}
        pageSize={pageSize}
        showPagination={false}
        fullBorder
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        onSelectRows={setSelectedRows as any}
        loadingContent={isLoadingSubjectReport && isSubjectCombination}
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
