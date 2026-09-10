"use client";

import { ArrowLeft, CheckboxCircleFill } from "@digenty/icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Avatar } from "@/components/Avatar";
import {
  DiaryCard,
  DiaryCardHeader,
  DotBadge,
  EntryTypeBadge,
  formatDateTime,
  formatDayAndMonth,
  getDiaryErrorMessage,
} from "@/components/DailyDiary/shared";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useAcknowledgeDailyReport,
  useAddParentDiaryComment,
  useDownloadParentReportPdf,
  useGetParentDailyReport,
  useToggleHomeworkDone,
  useUpdateParentDiaryComment,
} from "@/hooks/queryHooks/useParentDiary";
import { useStudentFilterStore } from "@/store/parent";

export const ParentDailyReport = ({ reportId }: { reportId: number }) => {
  const router = useRouter();
  const { selectedStudentId } = useStudentFilterStore();

  const [comment, setComment] = useState("");
  const [editingComment, setEditingComment] = useState(false);

  const { data: report, isPending, isError, error, refetch } = useGetParentDailyReport(reportId, selectedStudentId);
  const { mutate: acknowledge, isPending: signing } = useAcknowledgeDailyReport();
  const { mutate: addComment, isPending: commenting } = useAddParentDiaryComment();
  const { mutate: updateComment, isPending: updatingComment } = useUpdateParentDiaryComment();
  const { mutate: toggleHomework } = useToggleHomeworkDone();
  const { mutate: downloadPdf, isPending: downloading } = useDownloadParentReportPdf();

  useEffect(() => {
    if (report?.comment?.message && !editingComment) setComment(report.comment.message);
  }, [report?.comment?.message, editingComment]);

  if (isPending) {
    return (
      <div className="flex flex-col gap-5 p-4 md:p-8">
        <Skeleton className="bg-bg-input-soft h-16 w-full rounded-lg" />
        <Skeleton className="bg-bg-input-soft h-72 w-full rounded-lg" />
        <Skeleton className="bg-bg-input-soft h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="p-4 md:p-8">
        <ErrorComponent
          title="We could not load this report"
          description={getDiaryErrorMessage(error)}
          buttonText="Back to diary"
          url="/parents/daily-diary"
          onClick={() => refetch()}
        />
      </div>
    );
  }

  const isSigned = !!report.signedAt;
  const firstName = report.studentName?.split(" ")[0] ?? "your child";

  const handleSign = () => {
    acknowledge(
      { reportId, payload: { studentId: selectedStudentId as number, comment: comment.trim() || undefined } },
      {
        onSuccess: () => toast({ title: "Signed", description: "Your teacher can see that you have read today's report.", type: "success" }),
        onError: err => toast({ title: "Could not sign the report", description: getDiaryErrorMessage(err), type: "error" }),
      },
    );
  };

  const handleSaveComment = () => {
    const message = comment.trim();
    if (!message) return;

    const onDone = () => {
      setEditingComment(false);
      toast({ title: "Comment sent", description: `${report.teacherName} will see your message.`, type: "success" });
    };
    const onFail = (err: unknown) => toast({ title: "Could not send your comment", description: getDiaryErrorMessage(err), type: "error" });

    if (report.comment) updateComment({ commentId: report.comment.id, message }, { onSuccess: onDone, onError: onFail });
    else addComment({ reportId, payload: { studentId: selectedStudentId as number, message } }, { onSuccess: onDone, onError: onFail });
  };

  const handleDownload = () =>
    downloadPdf(
      { reportId, studentId: selectedStudentId as number },
      {
        onSuccess: result => {
          if (result?.url) window.open(result.url, "_blank", "noopener,noreferrer");
          else toast({ title: "Preparing your PDF", description: "We will notify you when it is ready.", type: "info" });
        },
        onError: err => toast({ title: "Could not download the report", description: getDiaryErrorMessage(err), type: "error" }),
      },
    );

  return (
    <div className="flex w-full flex-col gap-5 p-4 md:p-8">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => router.push("/parents/daily-diary")}
          className="border-border-darker text-text-default bg-bg-card h-8 shrink-0 gap-1.5 rounded-full"
        >
          <ArrowLeft fill="var(--color-icon-default)" className="size-4" />
          Back to diary
        </Button>
        <h1 className="text-text-default truncate text-lg font-semibold">{formatDayAndMonth(report.date)}</h1>
      </div>

      {/* Signed state (P2b) leads with the confirmation and the PDF. */}
      {isSigned && (
        <div className="border-border-green bg-bg-badge-green flex flex-col gap-3 rounded-lg border px-4 py-3.5 sm:flex-row sm:items-center">
          <CheckboxCircleFill fill="var(--color-icon-success)" className="size-5 shrink-0" />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="text-text-default text-[13px] leading-4.5 font-medium">
              Signed. {report.teacherName} can see that you have read this report.
            </p>
            <p className="text-text-muted text-xs leading-4">
              Recorded as {report.signedByName ?? report.signingAsName} · {formatDateTime(report.signedAt)}
            </p>
          </div>
          {report.downloadEnabled && (
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={downloading}
              className="border-border-darker text-text-default bg-bg-card shrink-0 rounded-full px-3.5"
            >
              {downloading ? "Preparing…" : "Download PDF"}
            </Button>
          )}
        </div>
      )}

      <DiaryCard>
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <Avatar url={report.teacherImage || undefined} className="size-9 shrink-0" />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="text-text-default text-[13px] leading-4.5 font-medium">
              {report.teacherName} · {report.teacherRole}
              {report.armName ? `, ${report.armName}` : ""}
            </p>
            <p className="text-text-muted text-xs leading-4">Signed and sent {formatDateTime(report.publishedAt)}</p>
          </div>
          {report.attendanceStatus && (
            <DotBadge
              label={
                report.attendanceStatus === "PRESENT"
                  ? `Present${report.arrivedAt ? ` · arrived ${formatDateTime(report.arrivedAt).split(", ")[1]}` : ""}`
                  : report.attendanceStatus === "LATE"
                    ? "Late"
                    : "Absent"
              }
              dot={report.attendanceStatus === "ABSENT" ? "bg-bg-basic-red-accent" : "bg-bg-basic-green-accent"}
              className={report.attendanceStatus === "ABSENT" ? "bg-bg-badge-red" : "bg-bg-badge-green"}
            />
          )}
        </div>
      </DiaryCard>

      <DiaryCard>
        <DiaryCardHeader
          title="Today's notes and reminders"
          description="Tick homework off as you complete it at home — your teacher sees the tick."
        />
        {report.entries.map(entry => {
          const isHomework = entry.type === "HOMEWORK";
          const isReminder = entry.type === "REMINDER";
          const tickable = isHomework || isReminder;

          return (
            <div key={entry.id} className="border-border-default flex gap-3 border-t px-4 py-3.5">
              {tickable ? (
                <Checkbox
                  checked={!!entry.completedAt}
                  onCheckedChange={checked =>
                    toggleHomework(
                      { reportId, entryId: entry.id, payload: { studentId: selectedStudentId as number, done: checked === true } },
                      {
                        onError: err => toast({ title: "Could not update", description: getDiaryErrorMessage(err), type: "error" }),
                      },
                    )
                  }
                  aria-label={`Mark ${entry.activity} as done`}
                  className="mt-0.5 size-4.5 shrink-0"
                />
              ) : (
                <span className="size-4.5 shrink-0" aria-hidden />
              )}

              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-text-default text-[13px] leading-4.5 font-medium">{entry.activity}</p>
                  <EntryTypeBadge type={entry.type} dueDate={entry.dueDate} />
                  {entry.completedAt && <span className="text-text-muted text-xs leading-4">· done at home</span>}
                </div>
                <p className="text-text-muted text-[13px] leading-4.5">{entry.note}</p>
              </div>
            </div>
          );
        })}
        {report.entries.length === 0 && (
          <p className="text-text-muted border-border-default border-t px-4 py-8 text-center text-[13px]">No notes were added for today.</p>
        )}
      </DiaryCard>

      {report.snapshot.length > 0 && (
        <DiaryCard>
          <div className="p-4">
            <p className="text-text-default text-sm leading-5 font-semibold">{firstName}&apos;s day</p>
          </div>
          <div className="flex flex-wrap gap-2 px-4 pb-4">
            {report.snapshot.map(item => (
              <span
                key={item.key}
                className="border-border-default bg-bg-basic-gray-alpha-4 text-text-default rounded-full border px-3 py-1.5 text-xs leading-4 font-medium"
              >
                {item.label}: {item.value}
              </span>
            ))}
          </div>
        </DiaryCard>
      )}

      {report.privateNote && (
        <div className="border-border-blue bg-bg-badge-blue flex flex-col gap-1.5 rounded-lg border p-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-text-default text-[13px] leading-4.5 font-semibold">A note just for you</p>
            <DotBadge label="Private" dot="bg-bg-basic-blue-accent" className="bg-bg-card" />
          </div>
          <p className="text-text-default text-[13px] leading-4.5">{report.privateNote}</p>
        </div>
      )}

      {(report.commentRequested || report.comment) && (
        <DiaryCard>
          <DiaryCardHeader
            title="Your comment"
            description={
              report.comment && !editingComment
                ? `Sent ${formatDateTime(report.comment.createdAt)} · only your child's teachers can see this.`
                : "Only your child's teachers can see this. Replaces the “Parent's comments” box in the diary."
            }
          />
          <div className="flex flex-col gap-3 px-4 pb-4">
            {report.comment && !editingComment ? (
              <>
                <div className="border-border-default bg-bg-basic-gray-alpha-2 rounded-lg border p-3">
                  <p className="text-text-default text-[13px] leading-4.5">{report.comment.message}</p>
                </div>

                {report.comment.replyMessage ? (
                  <div className="border-border-blue bg-bg-badge-blue flex flex-col gap-1.5 rounded-lg border p-3.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-text-default text-xs leading-4 font-medium">{report.comment.replyAuthorName} replied</p>
                      <p className="text-text-muted text-xs leading-4">· {formatDateTime(report.comment.replyCreatedAt)}</p>
                    </div>
                    <p className="text-text-default text-[13px] leading-4.5">{report.comment.replyMessage}</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <DotBadge label={`Awaiting ${report.teacherName}'s reply`} dot="bg-bg-basic-amber-accent" className="bg-bg-badge-amber" />
                    <div className="flex-1" />
                    <Button
                      variant="outline"
                      onClick={() => setEditingComment(true)}
                      className="border-border-darker text-text-default bg-bg-card rounded-full px-3.5"
                    >
                      Edit comment
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                <Textarea
                  value={comment}
                  onChange={event => setComment(event.target.value)}
                  placeholder={`Write a reply to ${report.teacherName}…`}
                  aria-label="Your comment"
                  rows={4}
                  className="border-border-default bg-bg-basic-gray-alpha-2 text-[13px]"
                />
                <div className="flex flex-wrap items-center gap-2">
                  {isSigned || editingComment ? (
                    <Button
                      onClick={handleSaveComment}
                      disabled={commenting || updatingComment || !comment.trim()}
                      className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default rounded-full px-3.5"
                    >
                      {commenting || updatingComment ? "Sending…" : report.comment ? "Save comment" : "Send comment"}
                    </Button>
                  ) : null}
                  {editingComment && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingComment(false);
                        setComment(report.comment?.message ?? "");
                      }}
                      className="border-border-darker text-text-default bg-bg-card rounded-full px-3.5"
                    >
                      Cancel
                    </Button>
                  )}
                  <div className="flex-1" />
                  <p className="text-text-muted text-xs leading-4">Comment is optional</p>
                </div>
              </>
            )}
          </div>
        </DiaryCard>
      )}

      {report.signatureRequired && !isSigned && (
        <div className="border-border-default bg-bg-sidebar-subtle rounded-lg border">
          <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="text-text-default text-sm leading-5 font-semibold">Parent&apos;s signature</p>
              <p className="text-text-muted max-w-115 text-xs leading-4">
                Tapping &ldquo;Seen &amp; signed&rdquo; records your name and the time — the digital version of signing the diary.{" "}
                {report.teacherName} will see that you have signed.
              </p>
              <p className="text-text-default text-xs leading-4 font-medium">
                Signing as {report.signingAsName}
                {report.signingAsRelationship ? ` · ${report.signingAsRelationship}` : ""}
              </p>
            </div>
            <Button
              onClick={handleSign}
              disabled={signing}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default shrink-0 rounded-full px-3.5"
            >
              {signing ? "Signing…" : "Seen & signed"}
            </Button>
          </div>
        </div>
      )}

      {isSigned && (
        <div className="border-border-default bg-bg-sidebar-subtle flex flex-col gap-3 rounded-lg border p-5 sm:flex-row sm:items-center">
          <CheckboxCircleFill fill="var(--color-icon-success)" className="size-7 shrink-0" />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="text-text-default text-sm leading-5 font-semibold">Seen &amp; signed by {report.signedByName ?? report.signingAsName}</p>
            <p className="text-text-muted text-xs leading-4">
              {formatDateTime(report.signedAt)}. Your signature and comment are kept with this report and appear in the term-end PDF.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/parents/daily-diary")}
            className="border-border-darker text-text-default bg-bg-card shrink-0 rounded-full px-3.5"
          >
            Back to diary
          </Button>
        </div>
      )}
    </div>
  );
};
