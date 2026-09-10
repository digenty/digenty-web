"use client";

import { ArrowLeft } from "@digenty/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Avatar } from "@/components/Avatar";
import { DiaryCard, DiaryCardHeader, DotBadge, formatDateTime, formatShortDate, getDiaryErrorMessage } from "@/components/DailyDiary/shared";
import { LearningAreasTable } from "@/components/DailyDiary/WeeklyReport/LearningAreasTable";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAcknowledgeWeeklyReport, useAddParentWeeklyComment, useGetParentWeeklyReport } from "@/hooks/queryHooks/useParentDiary";
import { useStudentFilterStore } from "@/store/parent";

const GlanceTile = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-bg-basic-gray-alpha-2 flex flex-1 flex-col gap-1 rounded-md p-3">
    <p className="text-text-muted text-[11px] leading-4 font-medium">{label}</p>
    <p className="text-text-default text-lg leading-6.5 font-medium">{value}</p>
  </div>
);

export const ParentWeeklyReport = ({ weeklyReportId }: { weeklyReportId: number }) => {
  const router = useRouter();
  const { selectedStudentId } = useStudentFilterStore();

  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  const { data: report, isPending, isError, error, refetch } = useGetParentWeeklyReport(weeklyReportId, selectedStudentId);
  const { mutate: acknowledge, isPending: signing } = useAcknowledgeWeeklyReport();
  const { mutate: addComment, isPending: commenting } = useAddParentWeeklyComment();

  if (isPending) {
    return (
      <div className="flex flex-col gap-5 p-4 md:p-8">
        <Skeleton className="bg-bg-input-soft h-16 w-full rounded-lg" />
        <Skeleton className="bg-bg-input-soft h-40 w-full rounded-lg" />
        <Skeleton className="bg-bg-input-soft h-80 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="p-4 md:p-8">
        <ErrorComponent
          title="We could not load this weekly report"
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

  const handleSign = () =>
    acknowledge(
      { weeklyReportId, payload: { studentId: selectedStudentId as number, comment: comment.trim() || undefined } },
      {
        onSuccess: () => {
          setAddingComment(false);
          setComment("");
          toast({ title: "Signed", description: "Your teacher can see that you have read this week's report.", type: "success" });
        },
        onError: err => toast({ title: "Could not sign the report", description: getDiaryErrorMessage(err), type: "error" }),
      },
    );

  const handleAddComment = () => {
    const message = comment.trim();
    if (!message) return;
    addComment(
      { weeklyReportId, payload: { studentId: selectedStudentId as number, message } },
      {
        onSuccess: () => {
          setAddingComment(false);
          setComment("");
          toast({ title: "Comment sent", description: `${report.teacherName} will see your message.`, type: "success" });
        },
        onError: err => toast({ title: "Could not send your comment", description: getDiaryErrorMessage(err), type: "error" }),
      },
    );
  };

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
        <h1 className="text-text-default truncate text-lg font-semibold">
          Week {report.weekNumber} · {formatShortDate(report.weekStart)} – {formatShortDate(report.weekEnd)}
        </h1>
      </div>

      <DiaryCard>
        <div className="flex items-center gap-3 p-4">
          <Avatar url={report.teacherImage || undefined} className="size-9 shrink-0" />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="text-text-default text-[13px] leading-4.5 font-medium">
              {report.teacherName} · {report.teacherRole}
              {report.armName ? `, ${report.armName}` : ""}
            </p>
            <p className="text-text-muted text-xs leading-4">
              {report.approvedByName ? `Approved by ${report.approvedByName} · ` : ""}
              sent {formatDateTime(report.publishedAt)}
            </p>
          </div>
        </div>
      </DiaryCard>

      <DiaryCard>
        <div className="p-4">
          <p className="text-text-default text-sm leading-5 font-semibold">{firstName}&apos;s week</p>
        </div>
        <div className="flex flex-col gap-3 px-4 pb-4 sm:flex-row">
          <GlanceTile label="Days present" value={`${report.glance.daysPresent} of ${report.glance.daysTotal}`} />
          <GlanceTile label="Homework done" value={`${report.glance.homeworkDone} of ${report.glance.homeworkSet}`} />
          <GlanceTile label="Notes from teacher" value={String(report.glance.notesToParents)} />
          <GlanceTile label="Your comments" value={String(report.glance.parentComments)} />
        </div>
      </DiaryCard>

      <LearningAreasTable
        rows={report.learningAreas}
        onChange={() => {}}
        readOnly
        title={`How ${firstName} is getting on`}
        description="Progress for this half term. “Emerging” simply means it is still new — it is not a grade."
      />

      <DiaryCard>
        <DiaryCardHeader title={`What ${report.teacherName} says`} />
        <div className="flex flex-col gap-3 px-4 pb-4">
          <p className="text-text-default text-[13px] leading-4.5">{report.teacherComment}</p>
          {report.nextWeekFocus && (
            <div className="bg-bg-basic-gray-alpha-2 flex flex-col gap-1 rounded-md p-3">
              <p className="text-text-default text-xs leading-4 font-medium">Next week&apos;s focus</p>
              <p className="text-text-muted text-[13px] leading-4.5">{report.nextWeekFocus}</p>
            </div>
          )}
        </div>
      </DiaryCard>

      <div className="border-border-default bg-bg-sidebar-subtle flex flex-col gap-3.5 rounded-lg border p-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="text-text-default text-sm leading-5 font-semibold">Your response</p>
          {isSigned ? (
            <DotBadge label="Signed" dot="bg-bg-basic-green-accent" className="bg-bg-badge-green" />
          ) : (
            <DotBadge label="Not signed yet" dot="bg-bg-basic-amber-accent" className="bg-bg-badge-amber" />
          )}
          <div className="hidden flex-1 sm:block" />
          {isSigned && (
            <p className="text-text-muted text-xs leading-4">
              {report.signedByName ?? report.signingAsName} · {formatDateTime(report.signedAt)}
            </p>
          )}
        </div>

        {report.comment && (
          <>
            <div className="border-border-default bg-bg-card rounded-lg border p-3.5">
              <p className="text-text-default text-[13px] leading-4.5">{report.comment.message}</p>
            </div>
            {report.comment.replyMessage && (
              <div className="border-border-blue bg-bg-badge-blue flex flex-col gap-1.5 rounded-lg border p-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-text-default text-xs leading-4 font-medium">{report.comment.replyAuthorName} replied</p>
                  <p className="text-text-muted text-xs leading-4">· {formatDateTime(report.comment.replyCreatedAt)}</p>
                </div>
                <p className="text-text-default text-[13px] leading-4.5">{report.comment.replyMessage}</p>
              </div>
            )}
          </>
        )}

        {addingComment && (
          <Textarea
            autoFocus
            value={comment}
            onChange={event => setComment(event.target.value)}
            placeholder={`Write a message to ${report.teacherName}…`}
            aria-label="Your comment"
            rows={4}
            className="border-border-default bg-bg-card text-[13px]"
          />
        )}

        <div className="flex flex-wrap items-center gap-2.5">
          {!isSigned && (
            <Button
              onClick={handleSign}
              disabled={signing}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default rounded-full px-3.5"
            >
              {signing ? "Signing…" : "Seen & signed"}
            </Button>
          )}

          {addingComment ? (
            <>
              <Button
                onClick={handleAddComment}
                disabled={commenting || !comment.trim()}
                className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default rounded-full px-3.5"
              >
                {commenting ? "Sending…" : "Send comment"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setAddingComment(false);
                  setComment("");
                }}
                className="border-border-darker text-text-default bg-bg-card rounded-full px-3.5"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={() => setAddingComment(true)}
              className="border-border-darker text-text-default bg-bg-card rounded-full px-3.5"
            >
              {report.comment ? "Add another comment" : "Add a comment"}
            </Button>
          )}

          <p className="text-text-muted text-xs leading-4">Your signature and comments are kept with this report.</p>
        </div>
      </div>
    </div>
  );
};
