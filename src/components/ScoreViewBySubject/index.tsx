"use client";

import { useEffect, useMemo, useState } from "react";
import { ScoreType, SubmitScorePayload, StudentUpdate } from "./types";

import { DataTable } from "@/components/DataTable";
import { scoreColumns } from "././Columns";
import { MobileCard } from "./MobileCard";
import { Skeleton } from "../ui/skeleton";
import { useAddScore } from "@/hooks/queryHooks/useScore";
import { ErrorComponent } from "../Error/ErrorComponent";
import { toast } from "@/components/Toast";
import { Grading } from "@/api/types";

export const ScoreViewBySubject = ({
  scores,
  isEditable = false,
  subjectId,
  armId,
  onSubmitTrigger,
  onSubmitSuccess,
  columns,
  gradings,
}: {
  scores: ScoreType[];
  isEditable?: boolean;
  subjectId: number;
  armId: number;
  onSubmitTrigger?: (submitFn: () => void) => void;
  onSubmitSuccess?: () => void;
  columns: string[];
  gradings: Grading[];
}) => {
  const [page, setPage] = useState(1);
  const [activeStudent, setActiveStudent] = useState<number>();
  const [scoreUpdates, setScoreUpdates] = useState<StudentUpdate[]>([]);

  const { mutate, isSuccess } = useAddScore();

  // Merge original scores with updates for display
  const mergedData = useMemo(() => {
    if (!scores) return [];
    return scores.map(student => {
      const update = scoreUpdates.find(u => u.studentId === student.studentId);
      if (!update) return student;

      const updatedAssessmentScores = { ...student.assessmentScores };
      update.scores.forEach(s => {
        const assessmentKey = String(s.assessmentId);
        if (updatedAssessmentScores[assessmentKey]) {
          updatedAssessmentScores[assessmentKey] = {
            ...updatedAssessmentScores[assessmentKey],
            score: s.score,
          };
        }
      });

      return {
        ...student,
        assessmentScores: updatedAssessmentScores,
      };
    });
  }, [scores, scoreUpdates]);

  const handleSubmit = () => {
    const payload: SubmitScorePayload = {
      subjectId,
      armId,
      status: "SUBMITTED",
      studentReports: mergedData.map(student => ({
        studentId: student.studentId,
        scores: [
          ...Object.entries(student.assessmentScores).map(([key, value]) => ({
            assessmentId: key,
            score: value.score,
          })),
        ],
      })),
    };

    console.log(payload);
    // mutate(payload);
  };

  useEffect(() => {
    if (isSuccess && onSubmitSuccess) {
      onSubmitSuccess();
    }
  }, [isSuccess, onSubmitSuccess]);

  useEffect(() => {
    if (onSubmitTrigger) {
      onSubmitTrigger(handleSubmit);
    }
  }, [mergedData, onSubmitTrigger]);

  if (columns.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center">
        <ErrorComponent title="Not Found" description="No assessments configured for this class or branch" buttonText="Contact Admin" />
      </div>
    );
  }

  return (
    <div>
      <div className="hidden pb-8 md:block">
        <DataTable
          pageSize={10}
          clickHandler={() => {}}
          rowSelection={{}}
          setRowSelection={() => {}}
          onSelectRows={() => {}}
          columns={scoreColumns(isEditable, columns, gradings)}
          data={mergedData}
          meta={{
            updateData: (rowIndex: number, columnId: string, value: unknown) => {
              const student = mergedData[rowIndex];
              if (!student) return;

              const newValue = Number(value);

              // Validate that the total sum does not exceed 100
              // This applies only if the column being updated is an assessment score
              if (!isNaN(newValue) && student.assessmentScores && columnId in student.assessmentScores) {
                const currentTotal = Object.entries(student.assessmentScores).reduce((sum, [id, assessment]) => {
                  if (id === columnId) return sum + newValue;
                  return sum + assessment.score;
                }, 0);

                if (currentTotal > 100) {
                  toast({
                    title: "Invalid Score",
                    description: "The total sum of scores cannot exceed 100.",
                    type: "error",
                  });
                  return; // Don't update if total exceeds 100
                }
              }

              setScoreUpdates(prev => {
                const existingStudentIndex = prev.findIndex(u => u.studentId === student.studentId);
                const score = newValue;

                if (existingStudentIndex > -1) {
                  const updatedUpdates = [...prev];
                  const existingScores = [...updatedUpdates[existingStudentIndex].scores];
                  const existingScoreIndex = existingScores.findIndex(s => s.assessmentId === columnId);

                  if (existingScoreIndex > -1) {
                    existingScores[existingScoreIndex] = { ...existingScores[existingScoreIndex], score };
                  } else {
                    existingScores.push({ assessmentId: columnId, score });
                  }

                  updatedUpdates[existingStudentIndex] = {
                    ...updatedUpdates[existingStudentIndex],
                    scores: existingScores,
                  };
                  return updatedUpdates;
                }

                return [...prev, { studentId: student.studentId, scores: [{ assessmentId: columnId, score }] }];
              });
            },
          }}
          totalCount={mergedData.length}
          page={page}
          setCurrentPage={setPage}
          fullBorder
          showPagination={false}
          classNames={{
            tableBodyCell: "text-center py-0 pr-2",
            tableHeadCell: "pr-2",
            tableHead: "bg-bg-subtle h-13.5",
          }}
        />
      </div>

      {!scores ? (
        <Skeleton className="bg-bg-card h-full w-full" />
      ) : (
        <ul className="flex flex-col gap-3 pb-8 md:hidden">
          {mergedData.map(student => {
            return (
              <MobileCard
                key={student.studentId}
                student={student}
                activeStudent={activeStudent}
                setActiveStudent={setActiveStudent}
                isEditable={isEditable}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};
