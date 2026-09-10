"use client";

import { LearningProgress, WeeklyLearningAreaRow } from "@/api/diary";
import { DiaryCard, DiaryCardHeader } from "@/components/DailyDiary/shared";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LEARNING_PROGRESS_CONFIG, LEARNING_PROGRESS_OPTIONS } from "@/queries/diary";

type Props = {
  rows: WeeklyLearningAreaRow[];
  onChange: (rows: WeeklyLearningAreaRow[]) => void;
  /** Parent-facing views render the same table without inputs. */
  readOnly?: boolean;
  disabled?: boolean;
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

// Stacks on mobile, falls into the paper diary's three columns from md up.
const GRID_ROW = "md:grid md:grid-cols-[minmax(120px,0.8fr)_minmax(200px,1.4fr)_minmax(240px,1.1fr)] md:gap-3";
const GRID_HEADER = "grid grid-cols-[minmax(120px,0.8fr)_minmax(200px,1.4fr)_minmax(240px,1.1fr)] gap-3";

export const LearningAreasTable = ({ rows, onChange, readOnly, disabled, title, description, action }: Props) => {
  const update = (areaId: number, patch: Partial<WeeklyLearningAreaRow>) =>
    onChange(rows.map(row => (row.areaId === areaId ? { ...row, ...patch } : row)));

  return (
    <DiaryCard>
      <DiaryCardHeader
        title={title ?? "Learning areas"}
        description={description ?? "Rate each area for the class, then adjust per pupil before sending."}
        action={action}
      />

      <div className={cn("bg-bg-basic-gray-alpha-4 hidden px-4 py-2.5 md:grid", GRID_HEADER)}>
        {["Area", "This week's focus", "Progress"].map(header => (
          <p key={header} className="text-text-muted text-[11px] leading-4 font-medium tracking-wide uppercase">
            {header}
          </p>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="text-text-muted border-border-default border-t px-4 py-8 text-center text-[13px]">
          No learning areas are configured for this level yet.
        </p>
      ) : (
        rows.map(row => (
          <div key={row.areaId} className={cn("border-border-default flex flex-col gap-3 border-t px-4 py-3 md:items-center", GRID_ROW)}>
            <p className="text-text-default text-[13px] leading-[18px] font-medium">{row.areaName}</p>

            {readOnly ? (
              <p className="text-text-muted text-[13px] leading-[18px]">{row.focus || "—"}</p>
            ) : (
              <Input
                value={row.focus}
                onChange={event => update(row.areaId, { focus: event.target.value })}
                placeholder="What the class worked on"
                aria-label={`Focus for ${row.areaName}`}
                disabled={disabled}
                className="border-border-default h-9 text-[13px]"
              />
            )}

            <div className="flex flex-wrap gap-1.5">
              {LEARNING_PROGRESS_OPTIONS.map(option => {
                const isActive = row.progress === option;
                const config = LEARNING_PROGRESS_CONFIG[option];
                return (
                  <button
                    key={option}
                    type="button"
                    disabled={readOnly || disabled}
                    aria-pressed={isActive}
                    onClick={() => update(row.areaId, { progress: isActive ? null : (option as LearningProgress) })}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs leading-4 transition-colors",
                      isActive ? cn(config.active, "font-medium") : "border-border-default bg-bg-card text-text-muted",
                      !readOnly && !disabled && !isActive && "hover:text-text-default",
                      readOnly && "cursor-default",
                    )}
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}
    </DiaryCard>
  );
};
