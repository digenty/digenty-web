"use client";

import { useRouter } from "next/navigation";

import { ClassDiarySummary, WeeklyClassDiarySummary } from "@/api/diary";
import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { Button } from "@/components/ui/button";
import { canManageDailyDiary } from "@/lib/permissions/daily-diary";
import { DAILY_REPORT_STATUS_CONFIG, WEEKLY_REPORT_STATUS_CONFIG } from "@/queries/diary";

import { DotBadge, formatTime, ProgressBar } from "./shared";

const statusTone = (status: ClassDiarySummary["status"]) => {
  if (status === "PUBLISHED") return "bg-bg-basic-green-accent";
  if (status === "DRAFT") return "bg-bg-basic-amber-accent";
  return "bg-bg-basic-gray-accent";
};

const CardShell = ({ children }: { children: React.ReactNode }) => (
  <div className="border-border-default bg-bg-sidebar-subtle flex flex-col gap-4 rounded-lg border p-5 md:p-6">{children}</div>
);

const CardTitle = ({ item }: { item: ClassDiarySummary }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2">
      <p className="text-text-default truncate text-sm leading-5 font-medium">{item.armName}</p>
      <div className="flex-1" />
      <DotBadge label={`${item.pupilCount} pupils`} dot="bg-bg-basic-gray-accent" className="bg-bg-card" />
    </div>
    <p className="text-text-muted truncate text-xs leading-4">{[item.teacherName, item.branchName].filter(Boolean).join(" • ") || "—"}</p>
  </div>
);

/** Daily-tab class card: publish state, parent sign-off progress and the primary action. */
export const ClassCard = ({ item }: { item: ClassDiarySummary }) => {
  const router = useRouter();
  const config = DAILY_REPORT_STATUS_CONFIG[item.status];

  const statusLabel = item.status === "PUBLISHED" && item.publishedAt ? `Published ${formatTime(item.publishedAt)}` : config.label;

  const subLabel = (() => {
    if (item.status === "PUBLISHED") return `${item.signedCount} of ${item.totalParents} parents signed`;
    if (item.status === "DRAFT") {
      const saved = item.lastSavedAt ? `Saved ${formatTime(item.lastSavedAt)}` : "Draft saved";
      return item.lastSavedBy ? `${saved} by ${item.lastSavedBy}` : saved;
    }
    return "No entry for today";
  })();

  const isPublished = item.status === "PUBLISHED";
  const openReport = () => router.push(`/staff/daily-diary/${item.armId}/report/${item.reportId}`);
  const writeReport = () => router.push(`/staff/daily-diary/${item.armId}/compose`);

  return (
    <CardShell>
      <CardTitle item={item} />

      <div className="flex flex-col gap-3">
        <DotBadge label={statusLabel} dot={config.dot} className={config.badge} />
        <p className="text-text-muted text-xs leading-4">{subLabel}</p>
        <ProgressBar value={isPublished ? item.signedCount : 0} total={item.totalParents} tone={statusTone(item.status)} />
      </div>

      {isPublished && item.reportId ? (
        <Button variant="outline" onClick={openReport} className="border-border-darker text-text-default bg-bg-card w-full rounded-md">
          Open →
        </Button>
      ) : (
        <PermissionCheck permissionUtility={canManageDailyDiary}>
          <Button
            onClick={writeReport}
            variant={item.status === "NOT_STARTED" ? "default" : "outline"}
            className={
              item.status === "NOT_STARTED"
                ? "bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default w-full rounded-md"
                : "border-border-darker text-text-default bg-bg-card w-full rounded-md"
            }
          >
            Write report →
          </Button>
        </PermissionCheck>
      )}
    </CardShell>
  );
};

/** Weekly-tab class card: approval state instead of parent sign-off. */
export const WeeklyClassCard = ({ item }: { item: WeeklyClassDiarySummary }) => {
  const router = useRouter();
  const config = item.weeklyStatus ? WEEKLY_REPORT_STATUS_CONFIG[item.weeklyStatus] : null;

  return (
    <CardShell>
      <CardTitle item={item} />

      <div className="flex flex-col gap-3">
        {config ? (
          <DotBadge label={config.label} dot={config.dot} className={config.badge} />
        ) : (
          <DotBadge label="Not started" dot="bg-bg-basic-gray-accent" className="bg-bg-card" />
        )}
        <p className="text-text-muted text-xs leading-4">
          {item.weeklyStatus === "PUBLISHED"
            ? `${item.signedCount} of ${item.totalParents} parents signed`
            : "Compiled from this week's daily entries"}
        </p>
        <ProgressBar
          value={item.weeklyStatus === "PUBLISHED" ? item.signedCount : 0}
          total={item.totalParents}
          tone={item.weeklyStatus === "PUBLISHED" ? "bg-bg-basic-green-accent" : "bg-bg-basic-amber-accent"}
        />
      </div>

      <Button
        onClick={() => router.push(`/staff/daily-diary/${item.armId}/weekly`)}
        variant={item.weeklyStatus ? "outline" : "default"}
        className={
          item.weeklyStatus
            ? "border-border-darker text-text-default bg-bg-card w-full rounded-md"
            : "bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default w-full rounded-md"
        }
      >
        {item.weeklyStatus ? "Open →" : "Write weekly report →"}
      </Button>
    </CardShell>
  );
};
