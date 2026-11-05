"use client";

import { ArrowLeftS, Eye, Save, SendPlaneFill, UserFill } from "@digenty/icons";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { DiaryEntryPayload, DiaryReportBatch, DiaryReportInstancePayload, SnapshotValues } from "@/api/diary";
import { AttendanceSession } from "@/api/types";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApplyDiaryTemplate, useGetDiarySettings, useOpenDiaryBatch, usePublishDiaryBatch, useSaveDiaryBatch } from "@/hooks/queryHooks/useDiary";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { DAILY_REPORT_STATUS_CONFIG } from "@/queries/diary";

import { DotBadge, formatLongDate, formatTime, getDiaryErrorMessage, sortEntries, toISODate } from "../shared";
import { CopyToPupilsModal } from "./CopyToPupilsModal";
import { EntriesTable } from "./EntriesTable";
import { ParentPreviewModal } from "./ParentPreviewModal";
import { PersonalNoteCard } from "./PersonalNoteCard";
import { PupilSwitcher } from "./PupilSwitcher";
import { DiaryPupil, SelectDiaryRecipientsModal } from "./SelectDiaryRecipientsModal";
import { SignOffCard, SignOffOptions } from "./SignOffCard";
import { SnapshotCard } from "./SnapshotCard";

const ComposeSkeleton = () => (
  <div className="flex flex-col gap-5">
    <Skeleton className="bg-bg-input-soft h-12 w-full rounded-lg" />
    <Skeleton className="bg-bg-input-soft h-96 w-full rounded-lg" />
    <Skeleton className="bg-bg-input-soft h-64 w-full rounded-lg" />
  </div>
);

const toInstancePayload = (instance: DiaryReportBatch["instances"][number]): DiaryReportInstancePayload => ({
  studentId: instance.studentId,
  included: instance.included,
  entries: sortEntries(instance.entries),
  snapshot: instance.snapshot ?? {},
  note: instance.note ?? "",
  requireAcknowledgement: instance.requireAcknowledgement,
  requestComment: instance.requestComment,
  sendPushSms: instance.sendPushSms,
});

const hasContent = (instance: DiaryReportBatch["instances"][number]) =>
  instance.entries.length > 0 || !!instance.note?.trim() || Object.values(instance.snapshot ?? {}).some(Boolean);

export const ComposeDailyReport = ({ armId, date, session: initialSession }: { armId: number; date?: string; session?: AttendanceSession }) => {
  const router = useRouter();
  const user = useLoggedInUser();

  const reportDate = date ?? toISODate(new Date());
  // Undefined for a class whose level takes one register a day. Set for a two-session level,
  // where the diary keys a separate batch to each of the morning and afternoon registers.
  const [session, setSession] = useState<AttendanceSession | undefined>(initialSession);

  const [batch, setBatch] = useState<DiaryReportBatch | null>(null);
  const [pupils, setPupils] = useState<DiaryPupil[]>([]);
  const [instances, setInstances] = useState<DiaryReportInstancePayload[]>([]);
  const [touched, setTouched] = useState<Set<number>>(new Set());
  const [activeStudentId, setActiveStudentId] = useState<number | null>(null);

  const [recipientsOpen, setRecipientsOpen] = useState(false);
  const [copyToOpen, setCopyToOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewStudentId, setPreviewStudentId] = useState<number | null>(null);

  const { data: settings } = useGetDiarySettings();
  const { mutate: openBatch, isPending: opening, isError: openFailed, error: openError, reset: resetOpen } = useOpenDiaryBatch();
  const { mutate: saveDraft, isPending: saving } = useSaveDiaryBatch();
  const { mutate: publish, isPending: publishing } = usePublishDiaryBatch();
  const { mutate: applyTemplate, isPending: copying } = useApplyDiaryTemplate();

  const hydrate = (detail: DiaryReportBatch) => {
    setBatch(detail);
    setPupils(
      detail.instances.map(instance => ({ studentId: instance.studentId, studentName: instance.studentName, studentImage: instance.studentImage })),
    );
    const payloads = detail.instances.map(toInstancePayload);
    setInstances(payloads);
    setTouched(new Set(detail.instances.filter(hasContent).map(instance => instance.studentId)));
    setActiveStudentId(prev => (prev && payloads.some(i => i.studentId === prev) ? prev : (payloads[0]?.studentId ?? null)));
    setPreviewStudentId(prev => (prev && payloads.some(i => i.studentId === prev) ? prev : (payloads[0]?.studentId ?? null)));
  };

  // The composer is reached straight from the class card, so open (or create) the batch on mount,
  // and again whenever the Morning/Afternoon toggle switches which session's batch is being edited.
  useEffect(() => {
    if (!armId) return;
    openBatch({ armId, date: reportDate, session }, { onSuccess: hydrate });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armId, reportDate, session]);

  const switchSession = (next: AttendanceSession) => {
    if (next === session) return;
    setSession(next);
    router.replace(`/staff/daily-diary/${armId}/compose?${new URLSearchParams({ date: reportDate, session: next })}`);
  };

  useBreadcrumb([
    { label: "Daily Diary", url: "/staff/daily-diary" },
    { label: batch?.armName ?? "Report", url: `/staff/daily-diary/${armId}/compose` },
  ]);

  const template = useMemo(() => {
    if (!settings || !batch) return undefined;
    const section = batch.levelType === "PRIMARY" ? "PRIMARY" : "EARLY_YEARS";
    return settings.templates?.find(item => item.section === section);
  }, [settings, batch]);

  const allowedTypes = template?.allowedEntryTypes ?? ["HOMEWORK", "REMINDER", "CLASS_NOTE"];
  const snapshotFields = batch?.snapshotEnabled ? (batch?.snapshotFields ?? []) : [];
  const signatureConfigurable = settings?.parentResponseRule !== "TRACK_OPENS_ONLY";

  const activeInstance = instances.find(instance => instance.studentId === activeStudentId);
  const activePupil = pupils.find(pupil => pupil.studentId === activeStudentId);
  const includedCount = instances.filter(instance => instance.included).length;

  const updateActive = (patch: Partial<DiaryReportInstancePayload>) => {
    if (activeStudentId === null) return;
    setInstances(prev => prev.map(instance => (instance.studentId === activeStudentId ? { ...instance, ...patch } : instance)));
    setTouched(prev => new Set(prev).add(activeStudentId));
  };

  const pupilNameById = useMemo(() => new Map(pupils.map(pupil => [pupil.studentId, pupil.studentName])), [pupils]);

  const buildPayload = (): { instances: DiaryReportInstancePayload[] } => ({
    instances: instances.map(instance => ({
      ...instance,
      // Persist the visible order rather than whatever order the rows were created in.
      entries: instance.entries.filter(entry => entry.activity.trim() || entry.note.trim()).map((entry, index) => ({ ...entry, position: index })),
      note: instance.note?.trim() ? instance.note : null,
    })),
  });

  const handleSaveDraft = () => {
    if (!batch) return;
    saveDraft(
      { batchId: batch.id, payload: buildPayload() },
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
    if (!batch) return;
    if (includedCount === 0) {
      toast({ title: "Select at least one parent", description: "Pick who this report should go to before publishing.", type: "warning" });
      return;
    }

    publish(
      { batchId: batch.id, payload: buildPayload() },
      {
        onSuccess: ({ batch: nextBatch, results }) => {
          hydrate(nextBatch);
          const publishedCount = results.filter(result => result.status === "PUBLISHED").length;
          const failed = results.filter(result => result.status === "FAILED");

          if (failed.length === 0) {
            toast({ title: "Report published", description: `Sent to ${publishedCount} parent${publishedCount === 1 ? "" : "s"}.`, type: "success" });
            router.push(`/staff/daily-diary/${armId}/report/${nextBatch.id}`);
            return;
          }

          const names = failed.map(result => pupilNameById.get(result.studentId) ?? "A pupil").join(", ");
          toast({
            title: `Sent to ${publishedCount}, ${failed.length} need fixing`,
            description: `${names}: ${failed[0]?.errors?.[0] ?? "check their entries before publishing again."}`,
            type: "warning",
          });
        },
        onError: error => toast({ title: "Could not publish report", description: getDiaryErrorMessage(error), type: "error" }),
      },
    );
  };

  const handleCopyTo = (targetStudentIds: number[]) => {
    if (!batch || activeStudentId === null) return;
    applyTemplate(
      { batchId: batch.id, payload: { sourceStudentId: activeStudentId, targetStudentIds } },
      {
        onSuccess: detail => {
          hydrate(detail);
          setTouched(prev => new Set([...prev, ...targetStudentIds]));
          setCopyToOpen(false);
          toast({
            title: "Copied",
            description: `Applied to ${targetStudentIds.length} pupil${targetStudentIds.length === 1 ? "" : "s"}.`,
            type: "success",
          });
        },
        onError: error => toast({ title: "Could not copy", description: getDiaryErrorMessage(error), type: "error" }),
      },
    );
  };

  if (opening && !batch) {
    return (
      <div className="flex flex-col gap-5 px-4 pt-4 pb-10 md:px-8 md:pt-6">
        <ComposeSkeleton />
      </div>
    );
  }

  if (openFailed || !batch || !activeInstance || !activePupil) {
    return (
      <div className="px-4 py-10 md:px-8">
        <ErrorComponent
          title="We could not open this report"
          description={getDiaryErrorMessage(openError)}
          buttonText="Try again"
          onClick={() => {
            resetOpen();
            openBatch({ armId, date: reportDate, session }, { onSuccess: hydrate });
          }}
        />
      </div>
    );
  }

  const statusConfig = DAILY_REPORT_STATUS_CONFIG[batch.status];
  // Includes opening so a session switch's re-fetch can't be raced by Save/Publish acting on stale form state.
  const busy = saving || publishing || opening || copying;
  const pupilStateById = Object.fromEntries(
    instances.map(instance => [instance.studentId, { included: instance.included, edited: touched.has(instance.studentId) }]),
  );
  const copyTargets = pupils.filter(pupil => pupil.studentId !== activeStudentId);
  const copyDefaultSelected = new Set(
    copyTargets.filter(pupil => pupilStateById[pupil.studentId]?.included && !touched.has(pupil.studentId)).map(pupil => pupil.studentId),
  );
  const previewInstance = instances.find(instance => instance.studentId === previewStudentId) ?? activeInstance;
  const previewPupil = pupils.find(pupil => pupil.studentId === previewStudentId) ?? activePupil;

  return (
    <div className="flex flex-col">
      <div className="border-border-default bg-bg-default sticky top-0 z-10 flex flex-col gap-3 border-b px-4 py-3 md:flex-row md:items-center md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            onClick={() => router.push("/staff/daily-diary")}
            className="border-border-default text-text-default bg-bg-card h-8 shrink-0 gap-1.5 rounded-md border"
          >
            <ArrowLeftS fill="var(--color-icon-default)" className="size-4" />
            Back
          </Button>
          <h1 className="text-text-default truncate text-lg leading-7 font-semibold">{batch.armName}</h1>
          <DotBadge label={statusConfig.label} dot={statusConfig.dot} className={statusConfig.badge} />
          {batch.lastSavedAt && <span className="text-text-muted hidden text-xs lg:inline">Autosaved {formatTime(batch.lastSavedAt)}</span>}
        </div>

        <div className="flex-1" />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => {
              setPreviewStudentId(activeStudentId);
              setPreviewOpen(true);
            }}
            className="border-border-default text-text-default bg-bg-card h-8 gap-1.5 rounded-md border"
          >
            <Eye fill="var(--color-icon-default)" className="size-4" />
            Preview as parent
          </Button>
          <Button
            onClick={handleSaveDraft}
            disabled={busy}
            className="border-border-default text-text-default bg-bg-card h-8 gap-1.5 rounded-md border"
          >
            <Save fill="var(--color-icon-default)" className="size-4" />
            {saving ? "Saving…" : "Save draft"}
          </Button>
          <Button
            onClick={handlePublish}
            disabled={busy}
            className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8 gap-1.5 rounded-md"
          >
            <SendPlaneFill fill="var(--color-icon-white-default)" className="size-4" />
            {publishing ? "Publishing…" : `Publish to ${includedCount} parent${includedCount === 1 ? "" : "s"}`}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-4 pt-5 pb-10 md:px-8 md:pb-12">
        <div className="border-border-blue bg-bg-badge-blue flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border px-4 py-3">
          {session && (
            <>
              <div className="bg-bg-state-soft flex w-fit shrink-0 items-center rounded-md p-[3px]">
                {(["MORNING", "AFTERNOON"] as const).map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => switchSession(option)}
                    disabled={busy}
                    className={`rounded px-2.5 py-1 text-xs leading-4 font-medium transition-colors ${
                      session === option ? "border-border-default bg-bg-card text-text-default border" : "text-text-muted hover:text-text-default"
                    }`}
                  >
                    {option === "MORNING" ? "Morning" : "Afternoon"}
                  </button>
                ))}
              </div>
              <span className="text-text-muted text-[13px]">•</span>
            </>
          )}
          <p className="text-text-default text-[13px] leading-[18px] font-medium">{formatLongDate(batch.date)}</p>
          <span className="text-text-muted text-[13px]">•</span>
          <p className="text-text-muted text-[13px] leading-[18px]">
            {batch.attendancePresent === null || batch.attendanceAbsent === null
              ? "Register has not been taken for this class yet"
              : `Attendance pulled from register: ${batch.attendancePresent} present, ${batch.attendanceAbsent} absent`}
          </p>
          <div className="hidden flex-1 lg:block" />
          <p className="text-text-default text-xs leading-4 font-medium">
            Sending to {includedCount} of {pupils.length} parents
          </p>
        </div>

        <div className="border-border-default bg-bg-card flex flex-col gap-3 rounded-lg border p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              <p className="text-text-default text-sm leading-5 font-semibold">Recipients</p>
              <p className="text-text-muted text-xs leading-4">
                Only parents left selected here receive anything when you publish. Each pupil below has their own, independent report.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setRecipientsOpen(true)}
              className="border-border-darker text-text-default bg-bg-card h-8 shrink-0 gap-1.5 rounded-md"
            >
              <UserFill fill="var(--color-icon-default)" className="size-4" />
              Edit recipients
            </Button>
          </div>

          <PupilSwitcher pupils={pupils} activeStudentId={activeStudentId} onSelect={setActiveStudentId} stateByStudentId={pupilStateById} />
        </div>

        {!activeInstance.included && (
          <div className="border-border-amber bg-bg-badge-amber flex flex-wrap items-center gap-2 rounded-lg border px-4 py-2.5">
            <p className="text-text-default text-[13px] leading-[18px]">
              {activePupil.studentName}&apos;s parent is not currently a recipient — anything saved here won&apos;t be sent.
            </p>
            <Button
              variant="outline"
              onClick={() => updateActive({ included: true })}
              className="border-border-darker text-text-default bg-bg-card h-7 shrink-0 rounded-md px-2.5 text-xs"
            >
              Add back as a recipient
            </Button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-text-default text-sm leading-5 font-semibold">Editing {activePupil.studentName}&apos;s report</p>
          {pupils.length > 1 && (
            <Button
              variant="outline"
              onClick={() => setCopyToOpen(true)}
              disabled={busy}
              className="border-border-darker text-text-default bg-bg-card h-8 rounded-md"
            >
              Copy to other pupils
            </Button>
          )}
        </div>

        <EntriesTable
          entries={activeInstance.entries}
          onChange={(entries: DiaryEntryPayload[]) => updateActive({ entries })}
          allowedTypes={allowedTypes}
          disabled={busy}
        />

        <SnapshotCard
          fields={snapshotFields}
          values={activeInstance.snapshot ?? {}}
          onChange={(snapshot: SnapshotValues) => updateActive({ snapshot })}
          disabled={busy}
        />

        <PersonalNoteCard
          studentName={activePupil.studentName}
          note={activeInstance.note ?? ""}
          onChange={note => updateActive({ note })}
          disabled={busy}
        />

        <SignOffCard
          value={{
            requireAcknowledgement: activeInstance.requireAcknowledgement ?? true,
            requestComment: activeInstance.requestComment ?? true,
            sendPushSms: activeInstance.sendPushSms ?? false,
          }}
          onChange={(value: SignOffOptions) => updateActive(value)}
          teacherName={user.name ?? "you"}
          teacherRole="Class teacher"
          armName={batch.armName}
          signatureConfigurable={signatureConfigurable}
          disabled={busy}
        />
      </div>

      <SelectDiaryRecipientsModal
        open={recipientsOpen}
        onOpenChange={setRecipientsOpen}
        pupils={pupils}
        includedIds={new Set(instances.filter(instance => instance.included).map(instance => instance.studentId))}
        onConfirm={includedIds => setInstances(prev => prev.map(instance => ({ ...instance, included: includedIds.has(instance.studentId) })))}
      />

      <CopyToPupilsModal
        open={copyToOpen}
        onOpenChange={setCopyToOpen}
        sourceName={activePupil.studentName}
        targets={copyTargets}
        defaultSelectedIds={copyDefaultSelected}
        onConfirm={handleCopyTo}
        isPending={copying}
      />

      {previewInstance && previewPupil && (
        <ParentPreviewModal
          open={previewOpen}
          setOpen={setPreviewOpen}
          date={batch.date}
          teacherName={user.name ?? "Your teacher"}
          teacherRole="Class teacher"
          armName={batch.armName}
          entries={sortEntries(previewInstance.entries)}
          snapshotFields={snapshotFields}
          snapshot={previewInstance.snapshot ?? {}}
          note={previewInstance.note ?? null}
          requireAcknowledgement={previewInstance.requireAcknowledgement ?? true}
          requestComment={previewInstance.requestComment ?? true}
          pupils={pupils}
          activeStudentId={previewStudentId}
          onSelectStudent={setPreviewStudentId}
        />
      )}
    </div>
  );
};
