"use client";

import { DiaryCard, DiaryCardHeader } from "@/components/DailyDiary/shared";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  studentName: string;
  note: string;
  onChange: (note: string) => void;
  disabled?: boolean;
};

/** Shown only to the active pupil's parent — each pupil's instance has its own, independent of everyone else's. */
export const PersonalNoteCard = ({ studentName, note, onChange, disabled }: Props) => {
  const firstName = studentName.split(" ")[0] || studentName;

  return (
    <DiaryCard>
      <DiaryCardHeader
        title={`Private note for ${firstName}'s parent`}
        description={`Only shown to ${firstName}'s parent — part of this pupil's own report, not sent to anyone else.`}
      />
      <div className="px-4 pb-4">
        <Textarea
          value={note}
          onChange={event => onChange(event.target.value)}
          disabled={disabled}
          placeholder={`Add a private note for ${firstName}'s parent…`}
          aria-label={`Private note for ${studentName}`}
          rows={3}
          className="border-border-default text-[13px]"
        />
      </div>
    </DiaryCard>
  );
};
