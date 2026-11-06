"use client";

import { useRouter } from "next/navigation";

import { DiaryReportInstance } from "@/api/diary";
import { Avatar } from "@/components/Avatar";
import { DiaryCard, DotBadge } from "@/components/DailyDiary/shared";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HEADERS = ["Pupil", "Status", "Signed", "Report"];
const GRID = "grid grid-cols-[minmax(160px,1.4fr)_minmax(140px,1fr)_minmax(140px,1fr)_100px] gap-3";

type Props = { armId: number; batchId: number; instances: DiaryReportInstance[] };

/** One row per pupil - each report is independent, so status and signatures are tracked per pupil, not per class. */
export const BatchInstancesTable = ({ armId, batchId, instances }: Props) => {
  const router = useRouter();

  return (
    <DiaryCard>
      <div className="flex flex-col gap-0.5 p-4">
        <p className="text-text-default text-sm leading-5 font-semibold">Recipients</p>
        <p className="text-text-muted text-xs leading-4">Each pupil below has their own report — excluded pupils never received anything.</p>
      </div>

      <div className={cn("bg-bg-basic-gray-alpha-4 hidden px-4 py-2.5 md:grid", GRID)}>
        {HEADERS.map(header => (
          <p key={header} className="text-text-muted text-[11px] leading-4 font-medium tracking-wide uppercase">
            {header}
          </p>
        ))}
      </div>

      {instances.map(instance => {
        const statusBadge = !instance.included ? (
          <DotBadge label="Not sent" dot="bg-bg-basic-gray-accent" className="bg-bg-badge-white" />
        ) : instance.status === "PUBLISHED" ? (
          <DotBadge label="Published" dot="bg-bg-basic-green-accent" className="bg-bg-badge-green" />
        ) : (
          <DotBadge label="Draft - not sent yet" dot="bg-bg-basic-amber-accent" className="bg-bg-badge-amber" />
        );

        const signedBadge =
          instance.status === "PUBLISHED" ? (
            instance.signedCount >= instance.recipientCount && instance.recipientCount > 0 ? (
              <DotBadge label="Signed" dot="bg-bg-basic-green-accent" className="bg-bg-badge-green" />
            ) : (
              <DotBadge
                label={`${instance.signedCount} of ${instance.recipientCount}`}
                dot="bg-bg-basic-amber-accent"
                className="bg-bg-badge-amber"
              />
            )
          ) : (
            <span className="text-text-muted text-[13px] leading-[18px]">—</span>
          );

        return (
          <div key={instance.studentId} className="border-border-default border-t px-4 py-3">
            <div className={cn("hidden items-center md:grid", GRID)}>
              <div className="flex min-w-0 items-center gap-2">
                <Avatar url={instance.studentImage || undefined} className="size-6 shrink-0" />
                <p className="text-text-default truncate text-[13px] leading-[18px] font-medium">{instance.studentName}</p>
              </div>
              <div>{statusBadge}</div>
              <div>{signedBadge}</div>
              {instance.reportId ? (
                <Button
                  variant="outline"
                  onClick={() => router.push(`/staff/daily-diary/${armId}/report/${batchId}/${instance.reportId}`)}
                  className="border-border-darker text-text-default bg-bg-card h-7 w-fit rounded-md px-2.5 text-xs"
                >
                  View
                </Button>
              ) : (
                <span className="text-text-muted text-[13px] leading-[18px]">—</span>
              )}
            </div>

            <div className="flex flex-col gap-2 md:hidden">
              <div className="flex items-center gap-2">
                <Avatar url={instance.studentImage || undefined} className="size-6 shrink-0" />
                <p className="text-text-default min-w-0 flex-1 truncate text-[13px] font-medium">{instance.studentName}</p>
                {statusBadge}
              </div>
              <div className="flex items-center justify-between">
                {signedBadge}
                {instance.reportId && (
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/staff/daily-diary/${armId}/report/${batchId}/${instance.reportId}`)}
                    className="border-border-darker text-text-default bg-bg-card h-7 w-fit rounded-md px-2.5 text-xs"
                  >
                    View
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </DiaryCard>
  );
};
