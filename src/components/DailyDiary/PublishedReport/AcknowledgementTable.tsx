"use client";

import { useState } from "react";

import { AcknowledgementFilter } from "@/api/diary";
import { Avatar } from "@/components/Avatar";
import { DiaryCard, DotBadge, formatTime } from "@/components/DailyDiary/shared";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetReportAcknowledgements } from "@/hooks/queryHooks/useDiary";
import { cn } from "@/lib/utils";
import { ACKNOWLEDGEMENT_FILTERS } from "@/queries/diary";

const HEADERS = ["Pupil", "Parent", "Opened", "Signed", "Comment"];
const GRID = "grid grid-cols-[minmax(160px,1.3fr)_minmax(140px,1.2fr)_minmax(100px,0.8fr)_minmax(140px,1fr)_minmax(160px,1.2fr)] gap-3";

/** Who opened, who signed, who commented — the compliance view the signature column exists for. */
export const AcknowledgementTable = ({ reportId }: { reportId: number }) => {
  const [filter, setFilter] = useState<AcknowledgementFilter>("ALL");
  const { data, isPending, isError, refetch } = useGetReportAcknowledgements(reportId, filter);

  const rows = data?.rows ?? [];
  const counts = data?.counts;

  return (
    <DiaryCard>
      <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-text-default text-sm leading-5 font-semibold">Parent acknowledgement</p>
          <p className="text-text-muted text-xs leading-4">The digital replacement for the parent&apos;s signature column.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {ACKNOWLEDGEMENT_FILTERS.map(option => {
            const count = counts?.[option.countKey];
            const isActive = filter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setFilter(option.value)}
                className={cn(
                  "rounded-full border px-3 py-[5px] text-xs leading-4 transition-colors",
                  isActive
                    ? "border-border-blue bg-bg-badge-blue text-text-default font-medium"
                    : "border-border-darker bg-bg-card text-text-muted hover:text-text-default",
                )}
              >
                {option.value === "ALL"
                  ? `All${count !== undefined ? ` ${count}` : ""}`
                  : `${option.label}${count !== undefined ? ` · ${count}` : ""}`}
              </button>
            );
          })}
        </div>
      </div>

      {isPending ? (
        <div className="border-border-default flex flex-col gap-2 border-t p-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="bg-bg-input-soft h-10 w-full rounded-md" />
          ))}
        </div>
      ) : isError ? (
        <div className="border-border-default flex flex-col items-center gap-2 border-t px-4 py-8">
          <p className="text-text-default text-sm font-medium">We could not load the acknowledgement list</p>
          <button type="button" onClick={() => refetch()} className="text-text-informative text-[13px] font-medium">
            Try again
          </button>
        </div>
      ) : rows.length === 0 ? (
        <p className="text-text-muted border-border-default border-t px-4 py-8 text-center text-[13px]">
          {filter === "ALL" ? "No parents are linked to this class yet." : "No parents in this group."}
        </p>
      ) : (
        <>
          <div className={cn("bg-bg-basic-gray-alpha-4 hidden px-4 py-2.5 md:grid", GRID)}>
            {HEADERS.map(header => (
              <p key={header} className="text-text-muted text-[11px] leading-4 font-medium tracking-wide uppercase">
                {header}
              </p>
            ))}
          </div>

          {rows.map(row => {
            const signedBadge = row.signedAt ? (
              <DotBadge label={`Signed ${formatTime(row.signedAt)}`} dot="bg-bg-basic-green-accent" className="bg-bg-badge-green" />
            ) : (
              <DotBadge
                label="Not signed"
                dot={row.openedAt ? "bg-bg-basic-amber-accent" : "bg-bg-basic-red-accent"}
                className={row.openedAt ? "bg-bg-badge-amber" : "bg-bg-badge-red"}
              />
            );

            return (
              <div key={`${row.studentId}-${row.parentId}`} className="border-border-default border-t px-4 py-3">
                {/* Desktop grid */}
                <div className={cn("hidden items-center md:grid", GRID)}>
                  <div className="flex min-w-0 items-center gap-2">
                    <Avatar url={row.studentImage || undefined} className="size-6 shrink-0" />
                    <p className="text-text-default truncate text-[13px] leading-[18px] font-medium">{row.studentName}</p>
                  </div>
                  <p className="text-text-muted truncate text-[13px] leading-[18px]">{row.parentName}</p>
                  <p className={cn("text-[13px] leading-[18px]", row.openedAt ? "text-text-muted" : "text-text-destructive")}>
                    {row.openedAt ? formatTime(row.openedAt) : "Not opened"}
                  </p>
                  <div>{signedBadge}</div>
                  <p className="text-text-muted truncate text-[13px] leading-[18px]">{row.commentPreview ?? "—"}</p>
                </div>

                {/* Mobile stack */}
                <div className="flex flex-col gap-2 md:hidden">
                  <div className="flex items-center gap-2">
                    <Avatar url={row.studentImage || undefined} className="size-6 shrink-0" />
                    <p className="text-text-default min-w-0 flex-1 truncate text-[13px] font-medium">{row.studentName}</p>
                    {signedBadge}
                  </div>
                  <p className="text-text-muted text-xs">
                    {row.parentName} · {row.openedAt ? `opened ${formatTime(row.openedAt)}` : "not opened"}
                  </p>
                  {row.commentPreview && <p className="text-text-muted text-[13px]">{row.commentPreview}</p>}
                </div>
              </div>
            );
          })}
        </>
      )}
    </DiaryCard>
  );
};
