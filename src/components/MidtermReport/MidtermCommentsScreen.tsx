"use client";

import { ArmCommentsPayload, MidtermCommentRow } from "@/api/types";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useGetArmMidtermComments, useSaveArmMidtermComments } from "@/hooks/queryHooks/useMidtermSettings";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { getApiErrorMessage, getApiErrorReason } from "@/lib/apiError";
import { canManageClassesAndSubjects } from "@/lib/permissions/classes-and-subjects";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { MIDTERM_COMMENT_MAX_LENGTH } from "../ClassesAndSubjects/Subjects/Score/MidtermComments";

type Kind = "subjects" | "categories";
const editKey = (studentId: number, kind: Kind, id: number) => `${studentId}:${kind}:${id}`;

// Errors that mean the grid on screen is stale (a subject/category/pupil changed since it loaded): reload it.
const STALE_GRID = /is not on this student's mid-term report|is not currently placed in that arm/i;
const NOT_COMMENT_CLASS = /does not use the comment-based/i;

const CommentBox = ({
  row,
  value,
  disabled,
  onChange,
}: {
  row: MidtermCommentRow;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) => (
  <div className="flex flex-col gap-1.5 md:flex-row md:items-start md:gap-3">
    <label className="text-text-subtle text-sm md:w-1/4 md:pt-2">{row.name}</label>
    <div className="flex-1">
      <Textarea
        value={value}
        maxLength={MIDTERM_COMMENT_MAX_LENGTH}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        placeholder={disabled ? "" : "Write a comment"}
        className="text-text-default border-border-default bg-bg-input-soft! focus:border-border-highlight! h-20 w-full resize-none rounded-lg border p-3 text-sm"
      />
      {!disabled && (
        <div className="text-text-muted mt-1 text-right text-xs">
          {value.length}/{MIDTERM_COMMENT_MAX_LENGTH}
        </div>
      )}
    </div>
  </div>
);

export const MidtermCommentsScreen = () => {
  const { armId: armIdParam } = useParams<{ armId: string }>();
  const armId = Number(armIdParam);
  const searchParams = useSearchParams();
  const classArmName = searchParams.get("classArmName")?.replaceAll("-", " ") || "";
  const { permissions } = useLoggedInUser();
  const canEdit = canManageClassesAndSubjects(permissions ?? []);

  useBreadcrumb([
    { label: "Classes and Subjects", url: "/staff/classes-and-subjects" },
    { label: "Classes", url: "/staff/classes-and-subjects" },
    { label: "Mid-term Comments", url: "" },
  ]);

  const { data: grid, isLoading, isError, error, refetch } = useGetArmMidtermComments({ armId });
  const { mutate: save, isPending: isSaving } = useSaveArmMidtermComments();
  const [edits, setEdits] = useState<Record<string, string>>({});

  const readOnly = !canEdit || !!grid?.published;

  const serverValue = (studentId: number, kind: Kind, id: number) =>
    grid?.students.find(s => s.studentId === studentId)?.[kind].find(r => r.id === id)?.comment ?? "";

  const dirtyKeys = useMemo(
    () =>
      Object.keys(edits).filter(key => {
        const [studentId, kind, id] = key.split(":");
        return edits[key].trim() !== (serverValue(Number(studentId), kind as Kind, Number(id)) ?? "").trim();
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [edits, grid],
  );

  const setEdit = (studentId: number, kind: Kind, id: number, value: string) =>
    setEdits(prev => ({ ...prev, [editKey(studentId, kind, id)]: value }));

  const handleSave = () => {
    const byStudent = new Map<number, ArmCommentsPayload["students"][number]>();
    for (const key of dirtyKeys) {
      const [studentIdRaw, kind, idRaw] = key.split(":");
      const studentId = Number(studentIdRaw);
      const entry = byStudent.get(studentId) ?? { studentId, subjects: [], categories: [] };
      // "" clears a comment, so a deliberately emptied box is sent as "".
      entry[kind as Kind].push({ id: Number(idRaw), comment: edits[key].trim() });
      byStudent.set(studentId, entry);
    }
    if (byStudent.size === 0) return;

    save(
      { armId, payload: { students: [...byStudent.values()] } },
      {
        onSuccess: () => {
          setEdits({});
          toast({ title: "Comments saved", type: "success" });
        },
        onError: (err: Error) => {
          toast({ title: "Could not save comments", description: getApiErrorReason(err), type: "error" });
          if (STALE_GRID.test(getApiErrorMessage(err, ""))) {
            setEdits({});
            refetch();
          }
        },
      },
    );
  };

  const errorMessage = getApiErrorMessage(error, "Please try again");

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-8 md:py-4">
      <div className="flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-text-default text-lg font-semibold md:text-xl">Mid-term Comments</h2>
          {classArmName && <span className="text-text-subtle text-sm">{classArmName}</span>}
        </div>
        {!readOnly && grid && (
          <Button
            onClick={handleSave}
            disabled={isSaving || dirtyKeys.length === 0}
            className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! flex h-8 w-fit items-center gap-1 text-sm font-normal"
          >
            {isSaving && <Spinner className="text-text-white-default size-3" />}
            Save comments{dirtyKeys.length > 0 && ` (${dirtyKeys.length})`}
          </Button>
        )}
      </div>

      {isLoading && <Skeleton className="bg-bg-input-soft h-100 w-full" />}

      {isError && (
        <div className="flex h-80 items-center justify-center">
          {NOT_COMMENT_CLASS.test(errorMessage) ? (
            <ErrorComponent
              title="This class does not use comment reports"
              description={errorMessage}
              buttonText="Go to mid-term settings"
              url="/staff/settings/academic"
            />
          ) : (
            <ErrorComponent title="Could not load comments" description={errorMessage} buttonText="Retry" onClick={() => refetch()} />
          )}
        </div>
      )}

      {grid?.published && (
        <p className="bg-bg-state-soft text-text-default rounded-md px-3 py-2 text-sm">
          This mid-term report has been published, so comments are locked. Unpublish it to edit them.
        </p>
      )}

      {grid && grid.students.length === 0 && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent title="No Students" description="There are no active students in this class" />
        </div>
      )}

      {grid && (
        <ul className="flex flex-col gap-4">
          {grid.students.map(student => (
            <li key={student.studentId} className="border-border-default bg-bg-card flex flex-col gap-4 rounded-md border p-4">
              <h3 className="text-text-default text-sm font-semibold">{student.studentName}</h3>

              {(["subjects", "categories"] as const).map(kind => {
                const rows = student[kind];
                if (rows.length === 0) return null;
                return (
                  <div key={kind} className="flex flex-col gap-3">
                    <h4 className="text-bg-basic-red-accent text-xs font-semibold uppercase">
                      {kind === "subjects" ? "Academic progress" : "Personal qualities"}
                    </h4>
                    {rows.map(row => (
                      <CommentBox
                        key={row.id}
                        row={row}
                        disabled={readOnly}
                        value={edits[editKey(student.studentId, kind, row.id)] ?? row.comment ?? ""}
                        onChange={value => setEdit(student.studentId, kind, row.id, value)}
                      />
                    ))}
                  </div>
                );
              })}
            </li>
          ))}
        </ul>
      )}

      <p className="text-text-muted text-xs">The class teacher&apos;s overall comment is entered on the Mid-term Comments tab of the score screen.</p>
    </div>
  );
};
