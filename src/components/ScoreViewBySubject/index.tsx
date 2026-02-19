"use client";

import { useEffect, useState } from "react";
import { ScoreType, SubmitScorePayload } from "./types";

import { DataTable } from "@/components/DataTable";
import { scoreColumns } from "././Columns";
import { MobileCard } from "./MobileCard";
import { Skeleton } from "../ui/skeleton";
import { useAddScore } from "@/hooks/queryHooks/useScore";

export const ScoreViewBySubject = ({
  scores,
  isEditable = false,
  subjectId,
  armId,
  onSubmitTrigger,
  onSubmitSuccess,
}: {
  scores: ScoreType[];
  isEditable?: boolean;
  subjectId: number;
  armId: number;
  onSubmitTrigger?: (submitFn: () => void) => void;
  onSubmitSuccess?: () => void;
}) => {
  const [page, setPage] = useState(1);
  const [activeStudent, setActiveStudent] = useState<number>();
  const [tableData, setTableData] = useState<ScoreType[]>(scores ?? []);
  console.log(scores);
  const { mutate, isSuccess } = useAddScore();

  console.log("SubjectId:", subjectId);
  const handleSubmit = () => {
    const payload: SubmitScorePayload = {
      subjectId,
      armId,
      status: "SUBMITTED",
      studentReports: tableData.map(student => ({
        studentId: student.studentId,
        CA1: student.CA1 ?? 0,
        CA2: student.CA2 ?? 0,
        examScore: student.examScore ?? 0,
      })),
    };

    mutate(payload);
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
  }, [tableData, onSubmitTrigger]);

  useEffect(() => {
    setTableData(scores ?? []);
  }, [scores]);

  return (
    <div>
      <div className="hidden pb-8 md:block">
        <DataTable
          pageSize={10}
          clickHandler={() => {}}
          rowSelection={{}}
          setRowSelection={() => {}}
          onSelectRows={() => {}}
          columns={scoreColumns(isEditable)}
          data={tableData}
          meta={{
            updateData: (rowIndex: number, columnId: string, value: unknown) => {
              setTableData(old =>
                old.map((row, index) => {
                  if (index === rowIndex) {
                    return {
                      ...row,
                      [columnId]: Number(value),
                    };
                  }
                  return row;
                }),
              );
            },
          }}
          totalCount={tableData.length}
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
          {scores.map(student => {
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
