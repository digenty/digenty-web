"use client";

import { useState } from "react";

import { PupilNote } from "@/api/diary";
import { Avatar } from "@/components/Avatar";
import { DiaryCard, DiaryCardHeader } from "@/components/DailyDiary/shared";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  pupilNotes: PupilNote[];
  onChange: (pupilNotes: PupilNote[]) => void;
  recipientCount: number;
  disabled?: boolean;
};

const PREVIEW_COUNT = 3;

/** Per-child private notes — the paper book is per child, so the class note needs a private lane. */
export const PupilNotesCard = ({ pupilNotes, onChange, recipientCount, disabled }: Props) => {
  const [showAll, setShowAll] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const withNote = pupilNotes.filter(pupil => !!pupil.note?.trim()).length;
  // Pupils who already have a note stay at the top so the teacher can review what is going out.
  const ordered = [...pupilNotes].sort((a, b) => Number(!!b.note?.trim()) - Number(!!a.note?.trim()));
  const visible = showAll ? ordered : ordered.slice(0, PREVIEW_COUNT);

  const setNote = (studentId: number, note: string) =>
    onChange(pupilNotes.map(pupil => (pupil.studentId === studentId ? { ...pupil, note } : pupil)));

  if (pupilNotes.length === 0) return null;

  return (
    <DiaryCard>
      <DiaryCardHeader
        title="Personalise for a pupil"
        description={`Private notes are shown only to that pupil's parents — everything above is sent to all ${recipientCount}.`}
      />

      <div className="flex flex-col">
        {visible.map(pupil => {
          const isEditing = editingId === pupil.studentId;
          const hasNote = !!pupil.note?.trim();

          return (
            <div key={pupil.studentId} className="border-border-default flex flex-col gap-3 border-t px-4 py-3.5 md:flex-row md:items-start md:gap-4">
              <div className="flex items-center gap-3 md:w-52 md:shrink-0">
                <Avatar url={pupil.studentImage || undefined} className="size-7 shrink-0" />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="text-text-default truncate text-[13px] leading-[18px] font-medium">{pupil.studentName}</p>
                  <p className="text-text-muted text-[11px] leading-4">{hasNote ? "Private note added" : "No private note"}</p>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                {isEditing ? (
                  <Textarea
                    autoFocus
                    value={pupil.note ?? ""}
                    onChange={event => setNote(pupil.studentId, event.target.value)}
                    onBlur={() => setEditingId(null)}
                    placeholder="Add a private note for this pupil's parent…"
                    aria-label={`Private note for ${pupil.studentName}`}
                    rows={2}
                    className="border-border-default text-[13px]"
                  />
                ) : (
                  <p className={`text-[13px] leading-[18px] ${hasNote ? "text-text-default" : "text-text-muted"}`}>
                    {hasNote ? pupil.note : "Add a private note for this pupil's parent…"}
                  </p>
                )}
              </div>

              <Button
                variant="ghost"
                disabled={disabled}
                onClick={() => setEditingId(isEditing ? null : pupil.studentId)}
                className="text-text-informative h-auto shrink-0 self-start text-[13px] leading-[18px] font-medium hover:bg-transparent"
              >
                {isEditing ? "Done" : hasNote ? "Edit" : "Add"}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 px-4 pt-3 pb-4 sm:flex-row sm:items-center">
        {pupilNotes.length > PREVIEW_COUNT && (
          <Button variant="outline" onClick={() => setShowAll(!showAll)} className="border-border-darker text-text-default bg-bg-card rounded-md">
            {showAll ? "Show fewer pupils" : `Show all ${pupilNotes.length} pupils`}
          </Button>
        )}
        <div className="flex-1" />
        <p className="text-text-muted text-xs leading-4">
          {withNote} of {pupilNotes.length} pupils have a private note
        </p>
      </div>
    </DiaryCard>
  );
};
