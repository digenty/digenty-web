"use client";

import { DiaryEntry, DiaryEntryType } from "@/api/diary";
import { cn } from "@/lib/utils";
import { DIARY_ENTRY_TYPE_CONFIG } from "@/queries/diary";

/* ------------------------------ Date helpers ------------------------------ */

const safeDate = (value: string | number | Date | null | undefined) => {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

/** "Friday, 12 September 2025" */
export const formatLongDate = (value: string | null | undefined) => {
  const date = safeDate(value);
  if (!date) return "—";
  return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
};

/** "Friday, 12 September" */
export const formatDayAndMonth = (value: string | null | undefined) => {
  const date = safeDate(value);
  if (!date) return "—";
  return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
};

/** "Mon, 15 Sep" */
export const formatShortDate = (value: string | null | undefined) => {
  const date = safeDate(value);
  if (!date) return "—";
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
};

/** "8:42 AM" */
export const formatTime = (value: string | null | undefined) => {
  const date = safeDate(value);
  if (!date) return "—";
  return date.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true });
};

/** "12 Sep 2025, 8:42 AM" */
export const formatDateTime = (value: string | null | undefined) => {
  const date = safeDate(value);
  if (!date) return "—";
  return `${date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, ${formatTime(value)}`;
};

/** YYYY-MM-DD in local time, which is what the API expects for report dates. */
export const toISODate = (date: Date) => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60 * 1000).toISOString().slice(0, 10);
};

/** Monday of the week containing `date`. */
export const startOfWeek = (date: Date) => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
};

/* --------------------------------- Badges --------------------------------- */

type DotBadgeProps = {
  label: string;
  /** Tailwind background class for the 6px status dot. */
  dot?: string;
  className?: string;
};

/** The dot-plus-label pill used across every diary surface. */
export const DotBadge = ({ label, dot, className }: DotBadgeProps) => (
  <span
    className={cn(
      "border-border-default text-text-default inline-flex w-fit shrink-0 items-center gap-1.5 rounded-md border px-2 py-[3px] text-xs leading-4 font-medium whitespace-nowrap",
      className,
    )}
  >
    {dot && <span className={cn("size-1.5 shrink-0 rounded-full", dot)} aria-hidden />}
    {label}
  </span>
);

export const EntryTypeBadge = ({ type, dueDate }: { type: DiaryEntryType; dueDate?: string | null }) => {
  const config = DIARY_ENTRY_TYPE_CONFIG[type];
  const label = config.requiresDueDate && dueDate ? `${config.label} · due ${formatShortDate(dueDate)}` : config.label;
  return <DotBadge label={label} dot={config.dot} className={config.badge} />;
};

/* ------------------------------- Entry sorting ---------------------------- */

export const sortEntries = <T extends Pick<DiaryEntry, "position">>(entries: T[]) => [...entries].sort((a, b) => a.position - b.position);

/* -------------------------------- Stat cards ------------------------------ */

export type StatSwatch = "blue" | "green" | "amber" | "pink";

const SWATCH: Record<StatSwatch, string> = {
  blue: "border-border-blue bg-bg-badge-blue",
  green: "border-border-green bg-bg-badge-green",
  amber: "border-border-amber bg-bg-badge-amber",
  pink: "border-border-pink bg-bg-badge-pink",
};

export const StatCard = ({ label, value, swatch }: { label: string; value: string; swatch: StatSwatch }) => (
  <div className="border-border-darker bg-bg-card flex flex-1 flex-col gap-4 rounded border p-4 md:p-6">
    <div className="flex items-center gap-2">
      <span className={cn("size-[17px] shrink-0 rounded-sm border", SWATCH[swatch])} aria-hidden />
      <p className="text-text-muted text-xs leading-4 font-medium">{label}</p>
    </div>
    <p className="text-text-default text-2xl leading-8 font-medium">{value}</p>
  </div>
);

/* --------------------------------- Progress ------------------------------- */

export const ProgressBar = ({ value, total, tone = "bg-bg-basic-green-accent" }: { value: number; total: number; tone?: string }) => {
  const percent = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <div
      className="bg-bg-basic-gray-alpha-10 h-1.5 w-full overflow-hidden rounded-full"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={cn("h-full rounded-full transition-[width]", tone)} style={{ width: `${percent}%` }} />
    </div>
  );
};

/* ---------------------------------- Cards --------------------------------- */

export const DiaryCard = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("border-border-default bg-bg-card w-full overflow-hidden rounded-lg border", className)}>{children}</div>
);

export const DiaryCardHeader = ({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) => (
  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-3">
    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
      <p className="text-text-default text-sm leading-5 font-semibold">{title}</p>
      {description && <p className="text-text-muted text-xs leading-4">{description}</p>}
    </div>
    {action}
  </div>
);

/* --------------------------------- Errors --------------------------------- */

export const getDiaryErrorMessage = (error: unknown) => (error as { message?: string })?.message ?? "Please try again.";
