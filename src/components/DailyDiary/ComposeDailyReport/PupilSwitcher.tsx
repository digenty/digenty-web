"use client";

import { Avatar } from "@/components/Avatar";
import { cn } from "@/lib/utils";

import { DiaryPupil } from "./SelectDiaryRecipientsModal";

type PupilState = { included: boolean; edited: boolean };

type Props = {
  pupils: DiaryPupil[];
  activeStudentId: number | null;
  onSelect: (studentId: number) => void;
  stateByStudentId: Record<number, PupilState>;
};

/** Switches which pupil's independent report is being edited — excluded pupils stay visible but dimmed. */
export const PupilSwitcher = ({ pupils, activeStudentId, onSelect, stateByStudentId }: Props) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {pupils.map(pupil => {
        const state = stateByStudentId[pupil.studentId];
        const isActive = pupil.studentId === activeStudentId;
        const firstName = pupil.studentName.split(" ")[0] || pupil.studentName;

        return (
          <button
            key={pupil.studentId}
            type="button"
            onClick={() => onSelect(pupil.studentId)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-1.5 text-[13px] leading-[18px] transition-colors",
              isActive
                ? "border-border-blue bg-bg-badge-blue text-text-default font-medium"
                : "border-border-darker bg-bg-card text-text-default hover:bg-bg-state-ghost-hover",
              !state?.included && "opacity-50",
            )}
          >
            <Avatar url={pupil.studentImage ?? undefined} className="size-5 shrink-0" />
            <span className={cn(!state?.included && "line-through")}>{firstName}</span>
            {!state?.included ? (
              <span className="text-text-muted text-[11px] leading-4">Not sending</span>
            ) : state?.edited ? (
              <span className="bg-bg-basic-green-accent size-1.5 shrink-0 rounded-full" aria-label="Edited" title="Edited" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
};
