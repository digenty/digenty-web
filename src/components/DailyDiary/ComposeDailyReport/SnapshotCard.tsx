"use client";

import { SnapshotField, SnapshotValues } from "@/api/diary";
import { DiaryCard, DiaryCardHeader } from "@/components/DailyDiary/shared";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type Props = {
  fields: SnapshotField[];
  values: SnapshotValues;
  onChange: (values: SnapshotValues) => void;
  applyToClass: boolean;
  onApplyToClassChange: (value: boolean) => void;
  disabled?: boolean;
};

/** Mood / meals / nap / toilet chips — configured per class in Diary settings. */
export const SnapshotCard = ({ fields, values, onChange, applyToClass, onApplyToClassChange, disabled }: Props) => {
  if (fields.length === 0) return null;

  const select = (key: SnapshotField["key"], option: string) => {
    // Tapping the selected chip again clears it, so a field can be left blank.
    onChange({ ...values, [key]: values[key] === option ? null : option });
  };

  return (
    <DiaryCard>
      <DiaryCardHeader title="Daily snapshot (optional)" description="Turned on per class in Diary settings. Choose the fields your school tracks." />

      <div className="flex flex-col gap-4 px-4 pb-4">
        {fields.map(field => (
          <div key={field.key} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <p className="text-text-default w-30 shrink-0 text-[13px] leading-[18px] font-medium">{field.label}</p>
            <div className="flex flex-wrap gap-2">
              {field.options.map(option => {
                const isActive = values[field.key] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    disabled={disabled}
                    aria-pressed={isActive}
                    onClick={() => select(field.key, option)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[13px] leading-[18px] transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                      isActive
                        ? "border-border-blue bg-bg-badge-blue text-text-default font-medium"
                        : "border-border-darker bg-bg-card text-text-muted hover:text-text-default",
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <label className="flex cursor-pointer items-start gap-2.5">
          <Checkbox
            checked={applyToClass}
            onCheckedChange={checked => onApplyToClassChange(checked === true)}
            disabled={disabled}
            className="mt-px"
          />
          <span className="text-text-default text-[13px] leading-[18px] font-medium">
            Apply this snapshot to the whole class, then edit individual pupils below
          </span>
        </label>
      </div>
    </DiaryCard>
  );
};
