"use client";

import { CheckboxCircleFill, Mail, SendPlaneFill, WarningIcon } from "@digenty/icons";
import { useEffect, useState } from "react";

import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useParentInviteStatus, useSendParentInvites } from "@/hooks/queryHooks/useParent";

// Matches the modal: the send is queued (202), so keep the counts refreshing for a minute.
const POLL_INTERVAL = 5000;
const POLL_CEILING = 60000;

/**
 * Final step of the parents bulk import. Parents are registered but not emailed, so the
 * school decides here whether to send their login details now or later.
 */
export const SendLoginDetailsStep = ({
  branchId,
  branchName,
  importedCount,
  onLater,
}: {
  branchId?: number;
  branchName?: string;
  importedCount: number;
  onLater: () => void;
}) => {
  const [isPolling, setIsPolling] = useState(false);
  const [result, setResult] = useState<{ targeted: number; skippedNoContact: number; message: string } | null>(null);

  const { mutate: sendInvites, isPending: sending } = useSendParentInvites();
  const {
    data: status,
    isPending: loadingStatus,
    isError: statusError,
  } = useParentInviteStatus({
    branchId,
    refetchInterval: isPolling ? POLL_INTERVAL : undefined,
  });

  useEffect(() => {
    if (!isPolling) return;
    const timer = setTimeout(() => setIsPolling(false), POLL_CEILING);
    return () => clearTimeout(timer);
  }, [isPolling]);

  const nothingToSend = !!status && status.pending === 0;

  const handleSend = () => {
    if (!branchId) return;

    sendInvites(
      { branchId },
      {
        onSuccess: response => {
          setResult(response);
          setIsPolling(true);
          toast({
            title: response.targeted > 0 ? `Sending login details to ${response.targeted} parent(s)` : "No login details to send",
            description: response.message,
            type: "success",
          });
        },
        onError: error => {
          toast({
            title: (error as { message?: string })?.message ?? "Something went wrong",
            description: "Could not send login details",
            type: "error",
          });
        },
      },
    );
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center justify-center">
        <span className="bg-bg-state-soft mb-3 flex size-10 items-center justify-center rounded-full">
          <Mail fill="var(--color-icon-default-subtle)" className="size-5" />
        </span>
        <h3 className="text-text-default text-lg font-semibold">Send Login Details?</h3>
        <p className="text-text-subtle max-w-100 text-center text-xs">
          {importedCount} parent(s) were imported{branchName ? ` into ${branchName}` : ""}. They are not emailed automatically — send their login
          details now, or later from the Parents tab.
        </p>
      </div>

      <div className="border-border-darker w-full space-y-4 rounded-md border p-6">
        {loadingStatus && !statusError ? (
          <Skeleton className="bg-bg-input-soft h-10 w-full" />
        ) : status ? (
          <div className="space-y-1">
            <p className="text-text-default text-sm font-medium">
              {status.pending} of {status.totalActive} parent(s) in this branch are waiting for their login details.
            </p>
            <p className="text-text-subtle text-xs">{status.invited} parent(s) already have theirs and will be skipped.</p>
          </div>
        ) : null}

        {nothingToSend && !result && (
          <div className="bg-bg-basic-orange-subtle border-border-default text-text-subtle shadow-light flex items-center gap-3 rounded-sm border px-2.5 py-2.5 text-sm">
            <WarningIcon />
            <p>Every parent in this branch already has their login details. There is nothing to send.</p>
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckboxCircleFill fill="var(--color-icon-success)" />
              <p className="text-text-subtle text-sm">{result.message}</p>
            </div>

            <div className="bg-bg-state-soft border-border-default text-text-subtle flex items-center gap-2.5 rounded-sm border px-3 py-2.5 text-sm">
              <Spinner className="text-icon-informative size-4" />
              <p>Sending is in progress. Login details go out over the next few minutes.</p>
            </div>

            {!!result.skippedNoContact && (
              <div className="bg-bg-basic-orange-subtle border-border-default text-text-subtle shadow-light flex items-center gap-3 rounded-sm border px-2.5 py-2.5 text-sm">
                <WarningIcon />
                <p>
                  {result.skippedNoContact} parent(s) have no email address or phone number and could not be reached. Add contact details to their
                  records, then send again.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-2 sm:flex-row">
        {result ? (
          <Button
            onClick={onLater}
            className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8 w-full rounded-md px-3 text-sm font-medium sm:w-auto"
          >
            Go to Parents
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={onLater}
              className="bg-bg-state-secondary border-border-darker text-text-default h-8 w-full rounded-md border px-3 text-sm font-medium sm:w-auto"
            >
              Send later
            </Button>

            <Button
              disabled={!branchId || sending || nothingToSend}
              onClick={handleSend}
              className={`h-8 w-full rounded-md px-3 text-sm font-medium sm:w-auto ${
                !branchId || sending || nothingToSend
                  ? "bg-bg-state-soft text-text-subtle"
                  : "bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default"
              }`}
            >
              {sending ? (
                <Spinner className="text-text-white-default" />
              ) : (
                <SendPlaneFill fill="var(--color-icon-white-default)" className="size-4" />
              )}
              <span>Send Now</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
