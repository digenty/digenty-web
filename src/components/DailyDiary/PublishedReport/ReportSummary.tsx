"use client";

import { DailyReportDetail } from "@/api/diary";
import { DiaryCard, DotBadge, EntryTypeBadge, formatDateTime, formatLongDate, sortEntries } from "@/components/DailyDiary/shared";
import { Button } from "@/components/ui/button";

type Props = {
  report: DailyReportDetail;
  onViewFullReport?: () => void;
};

/** Read-only rendering of what parents received. */
export const ReportSummary = ({ report, onViewFullReport }: Props) => {
  const snapshotChips = report.snapshotFields
    .map(field => ({ label: field.label, value: report.snapshot?.[field.key] }))
    .filter(item => !!item.value);

  return (
    <DiaryCard>
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-text-default text-sm leading-5 font-semibold">{formatLongDate(report.date)} — Daily report</p>
          <p className="text-text-muted text-xs leading-4">
            {report.publishedByName
              ? `Signed by ${report.publishedByName}${report.publishedByRole ? ` (${report.publishedByRole})` : ""} · ${formatDateTime(report.publishedAt)}`
              : `Published ${formatDateTime(report.publishedAt)}`}
          </p>
        </div>
        {onViewFullReport && (
          <Button variant="outline" onClick={onViewFullReport} className="border-border-darker text-text-default bg-bg-card h-8 shrink-0 rounded-md">
            View full report
          </Button>
        )}
      </div>

      {sortEntries(report.entries).map(entry => (
        <div key={entry.id} className="border-border-default flex flex-col gap-2 border-t px-4 py-3 md:flex-row md:items-center md:gap-4">
          <p className="text-text-default shrink-0 text-[13px] leading-[18px] font-medium md:w-40">{entry.activity}</p>
          <p className="text-text-muted min-w-0 flex-1 text-[13px] leading-[18px]">{entry.note}</p>
          <div className="shrink-0">
            <EntryTypeBadge type={entry.type} dueDate={entry.dueDate} />
          </div>
        </div>
      ))}

      {snapshotChips.length > 0 && (
        <div className="border-border-default flex flex-wrap items-center gap-2 border-t px-4 pt-3 pb-4">
          <p className="text-text-muted text-xs leading-4 font-medium">Daily snapshot:</p>
          {snapshotChips.map(chip => (
            <DotBadge key={chip.label} label={`${chip.label}: ${chip.value}`} dot="bg-bg-basic-gray-accent" className="bg-bg-card" />
          ))}
        </div>
      )}
    </DiaryCard>
  );
};
