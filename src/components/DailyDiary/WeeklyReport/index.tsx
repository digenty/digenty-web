"use client";

import { ArrowLeft } from "@digenty/icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SaveWeeklyReportPayload, WeeklyLearningAreaRow, WeeklyReportDetail } from "@/api/diary";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useApproveWeeklyReport, useOpenWeeklyReport, useSaveWeeklyReport, useSubmitWeeklyReport } from "@/hooks/queryHooks/useDiary";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { canApproveDiaryReports, canManageDailyDiary } from "@/lib/permissions/daily-diary";
import { WEEKLY_REPORT_STATUS_CONFIG } from "@/queries/diary";

import { DiaryCard, DiaryCardHeader, DotBadge, formatLongDate, formatShortDate, getDiaryErrorMessage, startOfWeek, toISODate } from "../shared";
import { LearningAreasTable } from "./LearningAreasTable";

const GlanceTile = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-bg-basic-gray-alpha-2 flex flex-1 flex-col gap-1 rounded-md p-3">
    <p className="text-text-muted text-[11px] leading-4 font-medium">{label}</p>
    <p className="text-text-default text-lg leading-[26px] font-medium">{value}</p>
  </div>
);

export const WeeklyReport = ({ armId, weekStart }: { armId: number; weekStart?: string }) => {
  const router = useRouter();
  const user = useLoggedInUser();

  const week = weekStart ?? toISODate(startOfWeek(new Date()));

  const [report, setReport] = useState<WeeklyReportDetail | null>(null);
  const [areas, setAreas] = useState<WeeklyLearningAreaRow[]>([]);
  const [teacherComment, setTeacherComment] = useState("");
  const [nextWeekFocus, setNextWeekFocus] = useState("");

  const { mutate: openReport, isPending: opening, isError: openFailed, error: openError } = useOpenWeeklyReport();
  const { mutate: save, isPending: saving } = useSaveWeeklyReport();
  const { mutate: submit, isPending: submitting } = useSubmitWeeklyReport();
  const { mutate: approve, isPending: approving } = useApproveWeeklyReport();

  const hydrate = (detail: WeeklyReportDetail) => {
    setReport(detail);
    setAreas(detail.learningAreas ?? []);
    setTeacherComment(detail.teacherComment ?? "");
    setNextWeekFocus(detail.nextWeekFocus ?? "");
  };

  useEffect(() => {
    if (!armId) return;
    openReport({ armId, weekStart: week }, { onSuccess: hydrate });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armId, week]);

  useBreadcrumb([
    { label: "Daily Diary", url: "/staff/daily-diary" },
    { label: "Weekly report", url: `/staff/daily-diary/${armId}/weekly` },
  ]);

  const buildPayload = (): SaveWeeklyReportPayload => ({
    learningAreas: areas.map(area => ({ areaId: area.areaId, focus: area.focus, progress: area.progress })),
    teacherComment,
    nextWeekFocus,
  });

  const handleSave = () => {
    if (!report) return;
    save(
      { weeklyReportId: report.id, payload: buildPayload() },
      {
        onSuccess: detail => {
          hydrate(detail);
          toast({ title: "Draft saved", type: "success" });
        },
        onError: error => toast({ title: "Could not save draft", description: getDiaryErrorMessage(error), type: "error" }),
      },
    );
  };

  const handleSubmit = () => {
    if (!report) return;
    if (!teacherComment.trim()) {
      toast({ title: "Add a weekly comment", description: "Parents expect a short summary of the week before the report is sent.", type: "warning" });
      return;
    }
    submit(
      { weeklyReportId: report.id, payload: buildPayload() },
      {
        onSuccess: detail => {
          hydrate(detail);
          toast({
            title: detail.approvalRequired ? "Sent for approval" : "Weekly report published",
            description: detail.approvalRequired
              ? `${detail.approverName ?? "The head teacher"} will review it before parents see it.`
              : `Sent to ${detail.recipientCount} parents.`,
            type: "success",
          });
        },
        onError: error => toast({ title: "Could not send report", description: getDiaryErrorMessage(error), type: "error" }),
      },
    );
  };

  const handleApprove = () => {
    if (!report) return;
    approve(report.id, {
      onSuccess: detail => {
        hydrate(detail);
        toast({ title: "Weekly report approved", description: `Sent to ${detail.recipientCount} parents.`, type: "success" });
      },
      onError: error => toast({ title: "Could not approve report", description: getDiaryErrorMessage(error), type: "error" }),
    });
  };

  if (opening && !report) {
    return (
      <div className="flex flex-col gap-5 px-4 pt-6 pb-10 md:px-8">
        <Skeleton className="bg-bg-input-soft h-12 w-full rounded-lg" />
        <Skeleton className="bg-bg-input-soft h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (openFailed || !report) {
    return (
      <div className="px-4 py-10 md:px-8">
        <ErrorComponent
          title="We could not open this weekly report"
          description={getDiaryErrorMessage(openError)}
          buttonText="Try again"
          onClick={() => openReport({ armId, weekStart: week }, { onSuccess: hydrate })}
        />
      </div>
    );
  }

  const statusConfig = WEEKLY_REPORT_STATUS_CONFIG[report.status];
  const busy = saving || submitting || approving;
  const isEditable = report.status === "DRAFT" || report.status === "REJECTED";
  const awaitingApproval = report.status === "PENDING_APPROVAL";

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
          <h1 className="text-text-default truncate text-lg leading-7 font-semibold">Weekly report · {report.armName}</h1>
          <DotBadge label={statusConfig.label} dot={statusConfig.dot} className={statusConfig.badge} />
        </div>

        <div className="flex-1" />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/staff/daily-diary/${armId}/weekly/preview?weekStart=${week}`)}
            className="border-border-darker text-text-default bg-bg-card h-8 rounded-md"
          >
            Preview as parent
          </Button>

          {isEditable && (
            <PermissionCheck permissionUtility={canManageDailyDiary}>
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={busy}
                className="border-border-darker text-text-default bg-bg-card h-8 rounded-md"
              >
                {saving ? "Saving…" : "Save draft"}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={busy}
                className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8 rounded-md"
              >
                {submitting ? "Sending…" : report.approvalRequired ? "Send for approval" : "Publish to parents"}
              </Button>
            </PermissionCheck>
          )}

          {awaitingApproval && (
            <PermissionCheck permissionUtility={canApproveDiaryReports}>
              <Button
                onClick={handleApprove}
                disabled={busy}
                className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8 rounded-md"
              >
                {approving ? "Approving…" : "Approve and send"}
              </Button>
            </PermissionCheck>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-5 px-4 pt-5 pb-10 md:px-8 md:pb-12">
        <div className="border-border-blue bg-bg-badge-blue flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border px-4 py-3">
          <p className="text-text-default text-[13px] leading-[18px] font-medium">
            Week {report.weekNumber} · {formatShortDate(report.weekStart)} – {formatLongDate(report.weekEnd)}
          </p>
          <span className="text-text-muted text-[13px]">•</span>
          <p className="text-text-muted text-[13px] leading-[18px]">
            Auto-compiled from this week&apos;s {report.dailyEntries?.length ?? 0} daily entries and the register
          </p>
          <div className="hidden flex-1 lg:block" />
          <p className="text-text-default text-xs leading-4 font-medium">Goes to {report.recipientCount} parents</p>
        </div>

        {report.status === "REJECTED" && report.rejectionReason && (
          <div className="border-border-red bg-bg-badge-red flex flex-col gap-1 rounded-lg border px-4 py-3">
            <p className="text-text-default text-[13px] font-semibold">Sent back for changes</p>
            <p className="text-text-muted text-xs leading-4">{report.rejectionReason}</p>
          </div>
        )}

        <div className="flex flex-col gap-5 xl:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <DiaryCard>
              <DiaryCardHeader title="This week at a glance" description="Pulled automatically — the teacher does not retype it." />
              <div className="flex flex-col gap-3 px-4 pb-4 sm:flex-row">
                <GlanceTile label="Days present" value={`${report.glance.daysPresent} of ${report.glance.daysTotal}`} />
                <GlanceTile label="Homework set" value={String(report.glance.homeworkSet)} />
                <GlanceTile label="Notes to parents" value={String(report.glance.notesToParents)} />
                <GlanceTile label="Parent responses" value={String(report.glance.parentResponses)} />
              </div>
            </DiaryCard>

            <LearningAreasTable rows={areas} onChange={setAreas} readOnly={!isEditable} disabled={busy} />

            <DiaryCard>
              <DiaryCardHeader title="Teacher's weekly comment" description="Sent to all parents. Add a per-pupil line in the pupil list below." />
              <div className="flex flex-col gap-3 px-4 pb-4">
                <Textarea
                  value={teacherComment}
                  onChange={event => setTeacherComment(event.target.value)}
                  placeholder="How the class got on this week…"
                  aria-label="Teacher's weekly comment"
                  readOnly={!isEditable}
                  disabled={busy}
                  rows={5}
                  className="border-border-default bg-bg-basic-gray-alpha-2 text-[13px]"
                />
                <p className="text-text-default text-[13px] leading-[18px] font-medium">Next week&apos;s focus</p>
                <Textarea
                  value={nextWeekFocus}
                  onChange={event => setNextWeekFocus(event.target.value)}
                  placeholder="What the class will work on next week…"
                  aria-label="Next week's focus"
                  readOnly={!isEditable}
                  disabled={busy}
                  rows={3}
                  className="border-border-default bg-bg-basic-gray-alpha-2 text-[13px]"
                />
              </div>
            </DiaryCard>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-5 xl:w-85">
            <DiaryCard>
              <DiaryCardHeader title="Recipients" />
              <div className="flex flex-col gap-2.5 px-4 pb-4">
                <p className="text-text-default text-[13px] leading-[18px] font-medium">
                  {report.recipientCount} parents · {report.armName}
                </p>
                <p className="text-text-muted text-xs leading-4">Parents will be asked to acknowledge and may reply with a comment.</p>
              </div>
            </DiaryCard>

            <DiaryCard>
              <DiaryCardHeader title="Daily entries this week" />
              {(report.dailyEntries ?? []).length === 0 ? (
                <p className="text-text-muted border-border-default border-t px-4 py-6 text-center text-[13px]">
                  No daily entries were published this week.
                </p>
              ) : (
                report.dailyEntries.map(entry => {
                  const allSigned = entry.totalParents > 0 && entry.signedCount === entry.totalParents;
                  return (
                    <button
                      key={entry.reportId}
                      type="button"
                      onClick={() => router.push(`/staff/daily-diary/${armId}/report/${entry.reportId}`)}
                      className="border-border-default hover:bg-bg-state-soft flex w-full items-center gap-2 border-t px-4 py-2.5 text-left transition-colors"
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <p className="text-text-default text-[13px] leading-[18px] font-medium">{formatShortDate(entry.date)}</p>
                        <p className="text-text-muted text-[11px] leading-4">
                          {entry.entryCount} entries · {entry.signedCount} signed
                        </p>
                      </div>
                      <span
                        className={`size-2 shrink-0 rounded-full ${allSigned ? "bg-bg-basic-green-accent" : "bg-bg-basic-amber-accent"}`}
                        aria-hidden
                      />
                    </button>
                  );
                })
              )}
            </DiaryCard>

            <div className="border-border-default bg-bg-sidebar-subtle rounded-lg border">
              <div className="p-4">
                <p className="text-text-default text-sm leading-5 font-semibold">Approval</p>
              </div>
              <div className="flex flex-col gap-2.5 px-4 pb-4">
                {report.approvalRequired ? (
                  <DotBadge label="Head teacher approval required" dot="bg-bg-basic-amber-accent" className="bg-bg-badge-amber" />
                ) : (
                  <DotBadge label="Publishes without approval" dot="bg-bg-basic-green-accent" className="bg-bg-badge-green" />
                )}
                <p className="text-text-muted text-xs leading-4">
                  {report.approvalRequired
                    ? `Weekly reports are reviewed by ${report.approverName ?? "the head teacher"} before parents see them. Daily entries publish without approval.`
                    : "Weekly reports go straight to parents. Daily entries publish without approval."}
                </p>
                <p className="text-text-default text-xs leading-4 font-medium">
                  Signed digitally as: {report.authorName ?? user.name ?? "—"}
                  {report.authorRole ? ` · ${report.authorRole}` : ""}
                  {report.armName ? `, ${report.armName}` : ""}
                </p>
                {report.approvedByName && <p className="text-text-muted text-xs leading-4">Approved by {report.approvedByName}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
