"use client";

import { CheckboxCircleFill } from "@digenty/icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

export type MidtermCommentStudent = { studentId: number; studentName: string };

export const MIDTERM_COMMENT_MAX_LENGTH = 1000;

// One comment box per student, held in the parent page's state (keyed by studentId) so edits survive switching
// tabs. Only edited students are submitted, since a missing midtermComment leaves the stored one alone.
export const MidtermComments = ({
  students,
  comments,
  onCommentChange,
  editable = false,
  onSubmit,
  isSubmitting = false,
  hasEdits,
}: {
  students: MidtermCommentStudent[];
  comments: Record<number, string>;
  onCommentChange: (studentId: number, value: string) => void;
  editable?: boolean;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  hasEdits: boolean;
}) => {
  return (
    <div className="flex flex-col gap-4 py-4">
      {editable && onSubmit && (
        <div className="flex justify-end px-4 md:px-8">
          <Button
            onClick={onSubmit}
            disabled={isSubmitting || !hasEdits}
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

      <ul className="flex flex-col gap-3 px-4 md:px-8">
        {students.map(student => (
          <li
            key={student.studentId}
            className="border-border-default bg-bg-card flex flex-col gap-2 rounded-md border p-3 md:flex-row md:items-start"
          >
            <div className="text-text-default text-sm font-medium md:w-1/4 md:pt-2">{student.studentName}</div>
            <Textarea
              value={comments[student.studentId] ?? ""}
              maxLength={MIDTERM_COMMENT_MAX_LENGTH}
              disabled={!editable}
              onChange={e => onCommentChange(student.studentId, e.target.value)}
              placeholder="Enter mid-term comment"
              className="text-text-default border-border-default bg-bg-input-soft! focus:border-border-highlight! h-20 flex-1 resize-none rounded-lg border p-3 text-sm"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
