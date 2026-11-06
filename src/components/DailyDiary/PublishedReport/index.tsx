"use client";

import { ArrowLeftS } from "@digenty/icons";
import { useRouter } from "next/navigation";

import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDiaryBatch, useGetDiaryBatchStats } from "@/hooks/queryHooks/useDiary";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { canManageDailyDiary } from "@/lib/permissions/daily-diary";
import { DAILY_REPORT_STATUS_CONFIG } from "@/queries/diary";

import { DotBadge, StatCard, formatShortDate, getDiaryErrorMessage } from "../shared";
import { BatchInstancesTable } from "./BatchInstancesTable";

/** The teacher's view of one compose session - every pupil's independent report, rolled up. */
export const PublishedReport = ({ armId, reportId: batchId }: { armId: number; reportId: number }) => {
  const router = useRouter();

  const { data: batch, isPending, isError, error, refetch } = useGetDiaryBatch(batchId);
  const { data: stats, isPending: loadingStats } = useGetDiaryBatchStats(batchId);

  useBreadcrumb([
    { label: "Daily Diary", url: "/staff/daily-diary" },
    { label: batch?.armName ?? "Report", url: `/staff/daily-diary/${armId}/report/${batchId}` },
  ]);

  if (isPending) {
    return (
      <div className="flex flex-col gap-5 px-4 pt-6 pb-10 md:px-8">
        <Skeleton className="bg-bg-input-soft h-28 w-full rounded" />
        <Skeleton className="bg-bg-input-soft h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !batch) {
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

  const statusConfig = DAILY_REPORT_STATUS_CONFIG[batch.status];

  return (
    <div className="flex flex-col">
      <div className="border-border-default bg-bg-default sticky top-0 z-10 flex flex-col gap-3 border-b px-4 py-3 md:flex-row md:items-center md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/staff/daily-diary")}
            className="border-border-darker text-text-default bg-bg-card h-8 shrink-0 gap-1.5 rounded-md"
          >
            <ArrowLeftS fill="var(--color-icon-default)" className="size-4" />
            Back
          </Button>
          <h1 className="text-text-default truncate text-lg leading-7 font-semibold">
            {batch.armName} · {formatShortDate(batch.date)}
          </h1>
          <DotBadge label={statusConfig.label} dot={statusConfig.dot} className={statusConfig.badge} />
          {batch.readOnly && <DotBadge label="Legacy report" dot="bg-bg-basic-gray-accent" className="bg-bg-badge-white" />}
        </div>

        <div className="flex-1" />

        {!batch.readOnly && (
          <div className="flex flex-wrap items-center gap-2">
            <PermissionCheck permissionUtility={canManageDailyDiary}>
              <Button
                onClick={() => router.push(`/staff/daily-diary/${armId}/compose?date=${batch.date}`)}
                className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8 rounded-md"
              >
                Add follow-up note
              </Button>
            </PermissionCheck>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5 px-4 pt-5 pb-10 md:px-8 md:pb-12">
        {batch.readOnly && (
          <div className="border-border-default bg-bg-sidebar-subtle rounded-lg border px-4 py-3">
            <p className="text-text-default text-[13px] leading-[18px]">
              This report predates per-pupil daily reports — every pupil below shares the same combined report.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 md:flex-row">
          {loadingStats || !stats ? (
            Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="bg-bg-input-soft h-28 flex-1 rounded-xl" />)
          ) : (
            <>
              <StatCard label="Recipients" value={`${stats.includedCount} of ${batch.pupilCount}`} swatch="blue" />
              <StatCard label="Published" value={`${stats.publishedCount} of ${stats.includedCount}`} swatch="green" />
              <StatCard label="Signed by parent" value={`${stats.signedCount} of ${stats.recipientCount}`} swatch="amber" />
              <StatCard label="Comments received" value={String(stats.commentCount)} swatch="pink" />
            </>
          )}
        </div>

        <BatchInstancesTable armId={armId} batchId={batch.id} instances={batch.instances} />
      </div>
    </div>
  );
};
