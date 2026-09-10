"use client";

import { useState } from "react";

import { Avatar } from "@/components/Avatar";
import { DiaryCard, DotBadge, formatTime, getDiaryErrorMessage } from "@/components/DailyDiary/shared";
import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useGetReportComments, useReplyToAllComments, useReplyToComment } from "@/hooks/queryHooks/useDiary";
import { canManageDailyDiary } from "@/lib/permissions/daily-diary";

/** Each parent gets their own thread — the paper diary has one shared box per page. */
export const CommentThreads = ({ reportId }: { reportId: number }) => {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyAllOpen, setReplyAllOpen] = useState(false);
  const [replyAllText, setReplyAllText] = useState("");

  const { data: comments, isPending, isError, refetch } = useGetReportComments(reportId);
  const { mutate: reply, isPending: replying } = useReplyToComment();
  const { mutate: replyAll, isPending: replyingAll } = useReplyToAllComments();

  const submitReply = (commentId: number) => {
    const message = replyText.trim();
    if (!message) return;
    reply(
      { reportId, commentId, message },
      {
        onSuccess: () => {
          setReplyingTo(null);
          setReplyText("");
          toast({ title: "Reply sent", type: "success" });
        },
        onError: error => toast({ title: "Could not send reply", description: getDiaryErrorMessage(error), type: "error" }),
      },
    );
  };

  const submitReplyAll = () => {
    const message = replyAllText.trim();
    if (!message) return;
    replyAll(
      { reportId, message },
      {
        onSuccess: result => {
          setReplyAllOpen(false);
          setReplyAllText("");
          toast({ title: "Reply sent", description: `Sent to ${result?.repliedCount ?? "all"} parents awaiting a reply.`, type: "success" });
        },
        onError: error => toast({ title: "Could not send replies", description: getDiaryErrorMessage(error), type: "error" }),
      },
    );
  };

  return (
    <DiaryCard>
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-text-default text-sm leading-5 font-semibold">Parent&apos;s comments</p>
          <p className="text-text-muted text-xs leading-4">
            Replaces the &ldquo;Parent&apos;s comments&rdquo; section of the paper diary. Replies are logged against the report.
          </p>
        </div>
        {!!comments?.length && (
          <PermissionCheck permissionUtility={canManageDailyDiary}>
            <Button
              variant="outline"
              onClick={() => setReplyAllOpen(!replyAllOpen)}
              className="border-border-darker text-text-default bg-bg-card h-8 shrink-0 rounded-md"
            >
              Reply to all
            </Button>
          </PermissionCheck>
        )}
      </div>

      {replyAllOpen && (
        <div className="border-border-default flex flex-col gap-2 border-t px-4 py-3">
          <Textarea
            autoFocus
            value={replyAllText}
            onChange={event => setReplyAllText(event.target.value)}
            placeholder="Write one reply to every parent still awaiting a response…"
            aria-label="Reply to all parents"
            rows={3}
            className="border-border-default text-[13px]"
          />
          <div className="flex gap-2">
            <Button
              onClick={submitReplyAll}
              disabled={replyingAll || !replyAllText.trim()}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8 rounded-md"
            >
              {replyingAll ? "Sending…" : "Send to all"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setReplyAllOpen(false)}
              className="border-border-darker text-text-default bg-bg-card h-8 rounded-md"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {isPending ? (
        <div className="border-border-default flex flex-col gap-3 border-t p-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="bg-bg-input-soft h-16 w-full rounded-md" />
          ))}
        </div>
      ) : isError ? (
        <div className="border-border-default flex flex-col items-center gap-2 border-t px-4 py-8">
          <p className="text-text-default text-sm font-medium">We could not load the comments</p>
          <button type="button" onClick={() => refetch()} className="text-text-informative text-[13px] font-medium">
            Try again
          </button>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-text-muted border-border-default border-t px-4 py-8 text-center text-[13px]">
          No parent has commented on this report yet.
        </p>
      ) : (
        comments.map(comment => (
          <div key={comment.id} className="border-border-default flex flex-col gap-2 border-t p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Avatar url={comment.parentImage || undefined} className="size-6 shrink-0" />
              <p className="text-text-default text-[13px] leading-[18px] font-medium">{comment.parentName}</p>
              <p className="text-text-muted text-xs leading-4">· parent of {comment.studentName}</p>
              <div className="hidden flex-1 sm:block" />
              <p className="text-text-muted text-xs leading-4">{formatTime(comment.createdAt)}</p>
            </div>

            <p className="text-text-default text-[13px] leading-[18px] sm:pl-8">{comment.message}</p>

            {comment.attachmentUrl && (
              <a href={comment.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-text-informative text-xs font-medium sm:pl-8">
                View attached photo
              </a>
            )}

            <div className="flex flex-wrap items-center gap-2 sm:pl-8">
              {comment.reply ? (
                <DotBadge
                  label={`Replied by ${comment.reply.authorName} · ${formatTime(comment.reply.createdAt)}`}
                  dot="bg-bg-basic-green-accent"
                  className="bg-bg-badge-green"
                />
              ) : (
                <>
                  <DotBadge label="Awaiting reply" dot="bg-bg-basic-amber-accent" className="bg-bg-badge-amber" />
                  <PermissionCheck permissionUtility={canManageDailyDiary}>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setReplyingTo(replyingTo === comment.id ? null : comment.id);
                        setReplyText("");
                      }}
                      className="border-border-darker text-text-default bg-bg-card h-8 rounded-md"
                    >
                      Reply
                    </Button>
                  </PermissionCheck>
                </>
              )}
            </div>

            {comment.reply && <p className="text-text-muted text-[13px] leading-[18px] sm:pl-8">{comment.reply.message}</p>}

            {replyingTo === comment.id && (
              <div className="flex flex-col gap-2 sm:pl-8">
                <Textarea
                  autoFocus
                  value={replyText}
                  onChange={event => setReplyText(event.target.value)}
                  placeholder={`Reply to ${comment.parentName}…`}
                  aria-label={`Reply to ${comment.parentName}`}
                  rows={3}
                  className="border-border-default text-[13px]"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => submitReply(comment.id)}
                    disabled={replying || !replyText.trim()}
                    className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8 rounded-md"
                  >
                    {replying ? "Sending…" : "Send reply"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setReplyingTo(null)}
                    className="border-border-darker text-text-default bg-bg-card h-8 rounded-md"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </DiaryCard>
  );
};
