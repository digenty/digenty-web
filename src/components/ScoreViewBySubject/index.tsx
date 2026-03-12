"use client";

import { useEffect, useMemo, useState } from "react";
import { ScoreType, StudentUpdate } from "./types";

import { Assessment, Grading } from "@/api/types";
import { DataTable } from "@/components/DataTable";
import { toast } from "@/components/Toast";
import { ErrorComponent } from "../Error/ErrorComponent";
import { Skeleton } from "../ui/skeleton";
import { scoreColumns } from "././Columns";
import { MobileCard } from "./MobileCard";

export const ScoreViewBySubject = ({
  scores,
  isEditable = false,
  columns,
  gradings,
  setUpdatedData,
}: {
  scores: ScoreType[];
  isEditable?: boolean;
  subjectId: number;
  armId: number;
  columns: Assessment[];
  gradings: Grading[];
  setUpdatedData: (data: ScoreType[]) => void;
}) => {
  const [page, setPage] = useState(1);
  const [activeStudent, setActiveStudent] = useState<number>();
  const [scoreUpdates, setScoreUpdates] = useState<StudentUpdate[]>([]);

  // Merge original scores with updates for display
  const mergedData = useMemo(() => {
    if (!scores) return [];
    return scores.map(student => {
      const update = scoreUpdates.find(u => u.studentId === student.studentId);
      if (!update) return student;

      const updatedAssessmentScores = { ...student.assessmentScores };

      update.scores.forEach(score => {
        const assessmentKey = String(score.assessmentId);
        if (updatedAssessmentScores[assessmentKey]) {
          updatedAssessmentScores[assessmentKey] = {
            ...updatedAssessmentScores[assessmentKey],
            score: score.score,
          };
        }
      });

      return {
        ...student,
        assessmentScores: updatedAssessmentScores,
      };
    });
  }, [scores, scoreUpdates]);

  useEffect(() => {
    setUpdatedData(mergedData);
  }, [mergedData]);

  if (columns.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center pt-15">
        <ErrorComponent title="Not Found" description="No assessments configured for this class or branch" buttonText="Contact Admin" />
      </div>
    );
  }

  const handleUpdateData = (studentId: number, columnId: string, value: unknown) => {
    const student = mergedData.find(s => s.studentId === studentId);
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
      const existingStudentIndex = prev.findIndex(u => u.studentId === studentId);
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

      return [...prev, { studentId: studentId, scores: [{ assessmentId: columnId, score }] }];
    });
  };

  return (
    <div>
      <div className="hidden pb-8 md:block">
        <DataTable
          pageSize={10}
          columns={scoreColumns(isEditable, columns, gradings)}
          data={mergedData}
          meta={{
            updateData: (rowIndex: number, columnId: string, value: unknown) => {
              const student = mergedData[rowIndex];
              if (student) {
                handleUpdateData(student.studentId, columnId, value);
              }
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
                gradings={gradings}
                onUpdateScore={(columnId, value) => handleUpdateData(student.studentId, columnId, value)}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};
