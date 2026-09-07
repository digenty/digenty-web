"use client";

import { CheckboxCircleFill } from "@digenty/icons";
import { RatingLegendEntry, StudentDevelopment } from "@/api/types";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { developmentColumns, DevelopmentRow, skillColumnId } from "./Columns";
import { DevelopmentMobileCard } from "./MobileCard";

export type DevelopmentPreviewStudent = {
  studentId: number;
  studentName: string;
};

// Laid out like the Standard tab (one roster table for the whole class) rather than one student at a
// time, since classes here can run into hundreds of students. Ratings live in the parent page's state
// (keyed by `${studentId}-${skillId}`) rather than here, so they survive switching between category tabs
// and can be gathered into a single class-wide submit via useSubmitArmTeacherInput. Initial values come
// from useArmDevelopmentData (hydrated from the batch GET); local edits are merged on top by the caller.
export const DevelopmentPreview = ({
  category,
  students,
  ratingLegend,
  ratings,
  onRatingChange,
  editable = false,
  onSubmit,
  isSubmitting = false,
}: {
  category: StudentDevelopment;
  students: DevelopmentPreviewStudent[];
  ratingLegend: RatingLegendEntry[];
  ratings: Record<string, string>;
  onRatingChange: (studentId: number, columnId: string, value: string) => void;
  editable?: boolean;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}) => {
  const [page, setPage] = useState(1);
  const [activeStudent, setActiveStudent] = useState<number>();

  const tableData: DevelopmentRow[] = students.map(student => {
    const row: DevelopmentRow = { studentId: student.studentId, studentName: student.studentName };
    category.skills.forEach((skill, index) => {
      const columnId = skillColumnId(skill, index);
      row[columnId] = ratings[`${student.studentId}-${columnId}`] ?? "";
    });
    return row;
  });

  const handleUpdateRating = (rowIndex: number, columnId: string, value: unknown) => {
    const student = tableData[rowIndex];
    if (!student) return;
    onRatingChange(student.studentId, columnId, String(value));
  };

  const hasRatings = Object.values(ratings).some(value => value);

  return (
    <div className="flex flex-col gap-4 py-4">
      {editable && onSubmit && (
        <div className="flex justify-end px-4 md:px-8">
          <Button
            onClick={onSubmit}
            disabled={isSubmitting || !hasRatings}
            size="sm"
            className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! flex h-8 w-30 items-center gap-1 text-sm font-normal"
          >
            {isSubmitting ? (
              <Spinner className="text-text-white-default size-3" />
            ) : (
              <CheckboxCircleFill fill="var(--color-icon-white-default)" className="size-3" />
            )}
            Submit
          </Button>
        </div>
      )}

      <div className="hidden px-4 md:block md:px-8">
        <DataTable
          pageSize={15}
          columns={developmentColumns(category.skills, editable)}
          data={tableData}
          totalCount={tableData.length}
          page={page}
          setCurrentPage={setPage}
          fullBorder
          showPagination={false}
          meta={{ updateData: handleUpdateRating }}
          classNames={{
            tableBodyCell: "text-center pr-2 py-2",
            tableHeadCell: "pr-2",
            tableHead: "bg-bg-subtle h-13.5",
          }}
        />
      </div>

      <ul className="flex flex-col gap-4 px-4 md:hidden">
        {tableData.map(student => (
          <DevelopmentMobileCard
            key={student.studentId}
            studentId={student.studentId}
            studentName={student.studentName}
            skills={category.skills}
            ratings={Object.fromEntries(
              category.skills.map((skill, index) => {
                const columnId = skillColumnId(skill, index);
                return [columnId, String(student[columnId] ?? "")];
              }),
            )}
            activeStudent={activeStudent}
            setActiveStudent={setActiveStudent}
            onRate={(columnId, value) => onRatingChange(student.studentId, columnId, value)}
            editable={editable}
          />
        ))}
      </ul>

      {ratingLegend.length > 0 && (
        <p className="text-text-muted px-4 text-xs italic md:px-8">
          Rating Scale: {ratingLegend.map(entry => `${entry.value} – ${entry.label}`).join(" | ")}
        </p>
      )}
    </div>
  );
};
