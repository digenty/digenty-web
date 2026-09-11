"use client";

import { ArrowLeft } from "@digenty/icons";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { DailyReportDetail, DiaryEntryPayload, PupilNote, SaveDailyReportPayload, SnapshotValues } from "@/api/diary";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDiarySettings, useOpenDailyReport, usePublishDailyReport, useSaveDailyReport } from "@/hooks/queryHooks/useDiary";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { DAILY_REPORT_STATUS_CONFIG } from "@/queries/diary";

import { DotBadge, formatLongDate, formatTime, getDiaryErrorMessage, sortEntries, toISODate } from "../shared";
import { EntriesTable } from "./EntriesTable";
import { PupilNotesCard } from "./PupilNotesCard";
import { SignOffCard, SignOffOptions } from "./SignOffCard";
import { SnapshotCard } from "./SnapshotCard";

const ComposeSkeleton = () => (
  <div className="flex flex-col gap-5">
    <Skeleton className="bg-bg-input-soft h-12 w-full rounded-lg" />
    <Skeleton className="bg-bg-input-soft h-96 w-full rounded-lg" />
    <Skeleton className="bg-bg-input-soft h-64 w-full rounded-lg" />
  </div>
);

export const ComposeDailyReport = ({ armId, date }: { armId: number; date?: string }) => {
  const router = useRouter();
  const user = useLoggedInUser();

  const reportDate = date ?? toISODate(new Date());

  const [report, setReport] = useState<DailyReportDetail | null>(null);
  const [entries, setEntries] = useState<DiaryEntryPayload[]>([]);
  const [snapshot, setSnapshot] = useState<SnapshotValues>({});
  const [applySnapshotToClass, setApplySnapshotToClass] = useState(true);
  const [pupilNotes, setPupilNotes] = useState<PupilNote[]>([]);
  const [signOff, setSignOff] = useState<SignOffOptions>({ requireAcknowledgement: true, requestComment: true, sendPushSms: false });

  const { data: settings } = useGetDiarySettings();
  const { mutate: openReport, isPending: opening, isError: openFailed, error: openError, reset: resetOpen } = useOpenDailyReport();
  const { mutate: saveDraft, isPending: saving } = useSaveDailyReport();
  const { mutate: publish, isPending: publishing } = usePublishDailyReport();

  const hydrate = (detail: DailyReportDetail) => {
    setReport(detail);
    setEntries(sortEntries(detail.entries));
    setSnapshot(detail.snapshot ?? {});
    setApplySnapshotToClass(detail.applySnapshotToClass);
    setPupilNotes(detail.pupilNotes ?? []);
    setSignOff({
      requireAcknowledgement: detail.requireAcknowledgement,
      requestComment: detail.requestComment,
      sendPushSms: detail.sendPushSms,
    });
  };

  // The composer is reached straight from the class card, so open (or create) the draft on mount.
  useEffect(() => {
    if (!armId) return;
    openReport({ armId, date: reportDate }, { onSuccess: hydrate });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armId, reportDate]);

  useBreadcrumb([
    { label: "Daily Diary", url: "/staff/daily-diary" },
    { label: report?.armName ?? "Report", url: `/staff/daily-diary/${armId}/compose` },
  ]);

  const template = useMemo(() => {
    if (!settings || !report) return undefined;
    const section = report.levelType === "PRIMARY" ? "PRIMARY" : "EARLY_YEARS";
    return settings.templates?.find(item => item.section === section);
  }, [settings, report]);

  const allowedTypes = template?.allowedEntryTypes ?? ["HOMEWORK", "REMINDER", "CLASS_NOTE"];
  const snapshotFields = report?.snapshotEnabled ? (report?.snapshotFields ?? []) : [];
  const signatureConfigurable = settings?.parentResponseRule !== "TRACK_OPENS_ONLY";

  const buildPayload = (): SaveDailyReportPayload => ({
    // Persist the visible order rather than whatever order the rows were created in.
    entries: entries.filter(entry => entry.activity.trim() || entry.note.trim()).map((entry, index) => ({ ...entry, position: index })),
    snapshot,
    applySnapshotToClass,
    pupilNotes: pupilNotes.map(pupil => ({ studentId: pupil.studentId, note: pupil.note?.trim() ? pupil.note : null, snapshot: pupil.snapshot })),
    ...signOff,
  });

  const handleSaveDraft = () => {
    if (!report) return;
    saveDraft(
      { reportId: report.id, payload: buildPayload() },
      {
        onSuccess: detail => {
          hydrate(detail);
          toast({ title: "Draft saved", description: "Parents cannot see this report yet.", type: "success" });
        },
        onError: error => toast({ title: "Could not save draft", description: getDiaryErrorMessage(error), type: "error" }),
      },
    );
  };

  const handlePublish = () => {
    if (!report) return;
    const filled = entries.filter(entry => entry.activity.trim() || entry.note.trim());
    if (filled.length === 0) {
      toast({
        title: "Add at least one entry",
        description: "A report needs one activity, note or reminder before it can go to parents.",
        type: "warning",
      });
      return;
    }
    const missingDueDate = filled.find(entry => (entry.type === "HOMEWORK" || entry.type === "REMINDER") && !entry.dueDate);
    if (missingDueDate) {
      toast({
        title: "A due date is missing",
        description: `"${missingDueDate.activity || missingDueDate.note}" is a ${missingDueDate.type === "HOMEWORK" ? "homework" : "reminder"} row and needs a due date.`,
        type: "warning",
      });
      return;
    }

    publish(
      { reportId: report.id, payload: buildPayload() },
      {
        onSuccess: detail => {
          toast({ title: "Report published", description: `Sent to ${detail.recipientCount} parents.`, type: "success" });
          router.push(`/staff/daily-diary/${armId}/report/${detail.id}`);
        },
        onError: error => toast({ title: "Could not publish report", description: getDiaryErrorMessage(error), type: "error" }),
      },
    );
  };

  if (opening && !report) {
    return (
      <div className="flex flex-col gap-5 px-4 pt-4 pb-10 md:px-8 md:pt-6">
        <ComposeSkeleton />
      </div>
    );
  }

  if (openFailed || !report) {
    return (
      <div className="px-4 py-10 md:px-8">
        <ErrorComponent
          title="We could not open this report"
          description={getDiaryErrorMessage(openError)}
          buttonText="Try again"
          onClick={() => {
            resetOpen();
            openReport({ armId, date: reportDate }, { onSuccess: hydrate });
          }}
        />
      </div>
    );
  }

  const statusConfig = DAILY_REPORT_STATUS_CONFIG[report.status];
  const busy = saving || publishing;

  return (
    <div className="flex flex-col">
      <div className="border-border-default bg-bg-default sticky top-0 z-10 flex flex-col gap-3 border-b px-4 py-3 md:flex-row md:items-center md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            onClick={() => router.push("/staff/daily-diary")}
            className="border-border-default text-text-default bg-bg-card h-8 shrink-0 gap-1.5 rounded-md border"
          >
            <ArrowLeft fill="var(--color-icon-default)" className="size-4" />
            Back
          </Button>
          <h1 className="text-text-default truncate text-lg leading-7 font-semibold">{report.armName}</h1>
          <DotBadge label={statusConfig.label} dot={statusConfig.dot} className={statusConfig.badge} />
          {report.lastSavedAt && <span className="text-text-muted hidden text-xs lg:inline">Autosaved {formatTime(report.lastSavedAt)}</span>}
        </div>

        <div className="flex-1" />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => router.push(`/staff/daily-diary/${armId}/preview?date=${reportDate}`)}
            className="border-border-default text-text-default bg-bg-card h-8 rounded-md border"
          >
            Preview as parent
          </Button>
          <Button onClick={handleSaveDraft} disabled={busy} className="border-border-default text-text-default bg-bg-card h-8 rounded-md border">
            {saving ? "Saving…" : "Save draft"}
          </Button>
          <Button
            onClick={handlePublish}
            disabled={busy}
            className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8 rounded-md"
          >
            {publishing ? "Publishing…" : "Publish to parents"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-4 pt-5 pb-10 md:px-8 md:pb-12">
        <div className="border-border-blue bg-bg-badge-blue flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border px-4 py-3">
          <p className="text-text-default text-[13px] leading-[18px] font-medium">{formatLongDate(report.date)}</p>
          <span className="text-text-muted text-[13px]">•</span>
          <p className="text-text-muted text-[13px] leading-[18px]">
            Attendance pulled from register: {report.attendancePresent} present, {report.attendanceAbsent} absent
          </p>
          <div className="hidden flex-1 lg:block" />
          <p className="text-text-default text-xs leading-4 font-medium">Goes to {report.recipientCount} parents</p>
        </div>

        <EntriesTable entries={entries} onChange={setEntries} allowedTypes={allowedTypes} disabled={busy} />

        <SnapshotCard
          fields={snapshotFields}
          values={snapshot}
          onChange={setSnapshot}
          applyToClass={applySnapshotToClass}
          onApplyToClassChange={setApplySnapshotToClass}
          disabled={busy}
        />

        <PupilNotesCard pupilNotes={pupilNotes} onChange={setPupilNotes} recipientCount={report.recipientCount} disabled={busy} />

        <SignOffCard
          value={signOff}
          onChange={setSignOff}
          teacherName={user.name ?? "you"}
          teacherRole="Class teacher"
          armName={report.armName}
          signatureConfigurable={signatureConfigurable}
          disabled={busy}
        />
      </div>
    </div>
  );
};
