"use client";

import { ArrowLeft } from "@digenty/icons";
import { useRouter } from "next/navigation";

import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useExportDailyReportPdf, useGetDailyReport, useGetDailyReportStats, useRemindUnsignedParents } from "@/hooks/queryHooks/useDiary";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { canManageDailyDiary } from "@/lib/permissions/daily-diary";

import { DotBadge, StatCard, formatShortDate, formatTime, getDiaryErrorMessage } from "../shared";
import { AcknowledgementTable } from "./AcknowledgementTable";
import { CommentThreads } from "./CommentThreads";
import { ReportSummary } from "./ReportSummary";

export const PublishedReport = ({ armId, reportId }: { armId: number; reportId: number }) => {
  const router = useRouter();

  const { data: report, isPending, isError, error, refetch } = useGetDailyReport(reportId);
  const { data: stats, isPending: loadingStats } = useGetDailyReportStats(reportId);
  const { mutate: remind, isPending: reminding } = useRemindUnsignedParents();
  const { mutate: exportPdf, isPending: exporting } = useExportDailyReportPdf();

  useBreadcrumb([
    { label: "Daily Diary", url: "/staff/daily-diary" },
    { label: report?.armName ?? "Report", url: `/staff/daily-diary/${armId}/report/${reportId}` },
  ]);

  const unsigned = stats ? stats.recipientCount - stats.signedCount : 0;

  const handleRemind = () =>
    remind(reportId, {
      onSuccess: result => toast({ title: "Reminders sent", description: `${result?.remindedCount ?? unsigned} parents reminded.`, type: "success" }),
      onError: err => toast({ title: "Could not send reminders", description: getDiaryErrorMessage(err), type: "error" }),
    });

  const handleExport = () =>
    exportPdf(reportId, {
      onSuccess: result => {
        if (result?.url) window.open(result.url, "_blank", "noopener,noreferrer");
        else toast({ title: "Export started", description: "You will be notified when the file is ready.", type: "info" });
      },
      onError: err => toast({ title: "Could not export report", description: getDiaryErrorMessage(err), type: "error" }),
    });

  if (isPending) {
    return (
      <div className="flex flex-col gap-5 px-4 pt-6 pb-10 md:px-8">
        <Skeleton className="bg-bg-input-soft h-28 w-full rounded" />
        <Skeleton className="bg-bg-input-soft h-72 w-full rounded-lg" />
        <Skeleton className="bg-bg-input-soft h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="px-4 py-10 md:px-8">
        <ErrorComponent
          title="We could not load this report"
          description={getDiaryErrorMessage(error)}
          buttonText="Try again"
          onClick={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="border-border-default bg-bg-default sticky top-0 z-10 flex flex-col gap-3 border-b px-4 py-3 md:flex-row md:items-center md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/staff/daily-diary")}
            className="border-border-darker text-text-default bg-bg-card h-8 shrink-0 gap-1.5 rounded-md"
          >
            <ArrowLeft fill="var(--color-icon-default)" className="size-4" />
            Back
          </Button>
          <h1 className="text-text-default truncate text-lg leading-7 font-semibold">
            {report.armName} · {formatShortDate(report.date)}
          </h1>
          {report.publishedAt && (
            <DotBadge label={`Published ${formatTime(report.publishedAt)}`} dot="bg-bg-basic-green-accent" className="bg-bg-badge-green" />
          )}
        </div>

        <div className="flex-1" />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exporting}
            className="border-border-darker text-text-default bg-bg-card h-8 rounded-md"
          >
            {exporting ? "Preparing…" : "Export PDF"}
          </Button>
          <PermissionCheck permissionUtility={canManageDailyDiary}>
            {unsigned > 0 && (
              <Button
                variant="outline"
                onClick={handleRemind}
                disabled={reminding}
                className="border-border-darker text-text-default bg-bg-card h-8 rounded-md"
              >
                {reminding ? "Sending…" : `Remind ${unsigned} parent${unsigned === 1 ? "" : "s"}`}
              </Button>
            )}
            <Button
              onClick={() => router.push(`/staff/daily-diary/${armId}/compose`)}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8 rounded-md"
            >
              Add follow-up note
            </Button>
          </PermissionCheck>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-4 pt-5 pb-10 md:px-8 md:pb-12">
        <div className="flex flex-col gap-3 md:flex-row">
          {loadingStats || !stats ? (
            Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="bg-bg-input-soft h-28 flex-1 rounded" />)
          ) : (
            <>
              <StatCard label="Sent to" value={`${stats.recipientCount} parents`} swatch="blue" />
              <StatCard label="Opened" value={`${stats.openedCount} of ${stats.recipientCount}`} swatch="green" />
              <StatCard label="Signed by parent" value={`${stats.signedCount} of ${stats.recipientCount}`} swatch="amber" />
              <StatCard label="Comments received" value={String(stats.commentCount)} swatch="pink" />
            </>
          )}
        </div>

        <ReportSummary report={report} />

        <AcknowledgementTable reportId={reportId} />

        <CommentThreads reportId={reportId} />
      </div>
    </div>
  );
};
