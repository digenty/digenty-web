"use client";

import { Mail, SendPlaneFill, WarningIcon } from "@digenty/icons";
import { useEffect, useMemo, useState } from "react";

import { BranchWithClassLevels } from "@/api/types";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DrawerFooter } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useParentInviteStatus, useSendParentInvites } from "@/hooks/queryHooks/useParent";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

// The backend queues the send and returns 202, so the counts keep moving after the
// request resolves. Poll the status endpoint for a minute, then stop.
const POLL_INTERVAL = 5000;
const POLL_CEILING = 60000;

export const SendLoginDetailsModal = ({
  open,
  setOpen,
  branchId,
  parentIds,
  title = "Send Login Details",
  description,
  requireConfirmation = false,
  laterLabel = "Send later",
  onLater,
  onDone,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Branch to send to. When omitted the modal asks the user to pick one. */
  branchId?: number;
  /** Restricts the send to these parents. Omit to target the whole branch. */
  parentIds?: number[];
  title?: string;
  description?: string;
  /** Gate the send button behind an "I understand" checkbox. */
  requireConfirmation?: boolean;
  laterLabel?: string;
  onLater?: () => void;
  onDone?: () => void;
}) => {
  const isMobile = useIsMobile();
  const { branchIds, isMain, isAdmin, adminBranchIds } = useLoggedInUser();
  const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>(branchId);
  const [isChecked, setIsChecked] = useState(false);
  const [hasSent, setHasSent] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [result, setResult] = useState<{ targeted: number; skippedNoContact: number; message: string } | null>(null);

  const scopedToParents = !!parentIds?.length;
  const effectiveBranchId = branchId ?? selectedBranchId;

  const { data: branches, isPending: loadingBranches } = useGetBranches();
  const { mutate: sendInvites, isPending: sending } = useSendParentInvites();
  const {
    data: status,
    isPending: loadingStatus,
    isError: statusError,
  } = useParentInviteStatus({
    branchId: effectiveBranchId,
    enabled: open,
    refetchInterval: isPolling ? POLL_INTERVAL : undefined,
  });

  const userBranchIds = useMemo(() => branchIds ?? [], [branchIds]);
  const hasFullAccess = isMain || isAdmin || (adminBranchIds?.length ?? 0) > 0;
  const isBranchRestricted = !hasFullAccess && userBranchIds.length > 0;

  const selectableBranches: BranchWithClassLevels[] = useMemo(() => {
    if (!branches?.data) return [];
    if (!isBranchRestricted) return branches.data;
    return branches.data.filter((b: BranchWithClassLevels) => userBranchIds.includes(b.branch.id));
  }, [branches, isBranchRestricted, userBranchIds]);

  useEffect(() => {
    setSelectedBranchId(branchId);
  }, [branchId]);

  // A branch-restricted user only ever has one branch to send to - preselect it.
  useEffect(() => {
    if (branchId || selectedBranchId || selectableBranches.length !== 1) return;
    setSelectedBranchId(selectableBranches[0].branch.id);
  }, [branchId, selectedBranchId, selectableBranches]);

  useEffect(() => {
    if (!isPolling) return;
    const timer = setTimeout(() => setIsPolling(false), POLL_CEILING);
    return () => clearTimeout(timer);
  }, [isPolling]);

  useEffect(() => {
    if (open) return;
    setIsChecked(false);
    setHasSent(false);
    setIsPolling(false);
    setResult(null);
  }, [open]);

  const nothingToSend = !scopedToParents && !!status && status.pending === 0;
  const canSend = !!effectiveBranchId && !sending && !nothingToSend && (!requireConfirmation || isChecked);

  const handleSend = () => {
    if (!effectiveBranchId) return;

    sendInvites(
      { branchId: effectiveBranchId, ...(scopedToParents ? { parentIds } : {}) },
      {
        onSuccess: response => {
          setResult(response);
          setHasSent(true);
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

  const handleLater = () => {
    setOpen(false);
    onLater?.();
  };

  const handleDone = () => {
    setOpen(false);
    onDone?.();
  };

  const statusSummary =
    effectiveBranchId && !statusError ? (
      loadingStatus ? (
        <Skeleton className="bg-bg-input-soft h-10 w-full" />
      ) : status ? (
        <div className="bg-bg-state-soft border-border-default text-text-subtle flex flex-col gap-1 rounded-sm border px-3 py-2.5 text-sm">
          <p>
            <span className="text-text-default font-medium">
              {status.pending} of {status.totalActive}
            </span>{" "}
            parent(s) in this branch are waiting for their login details.
          </p>
          <p className="text-text-subtle text-xs">{status.invited} parent(s) already have theirs and will be skipped.</p>
        </div>
      ) : null
    ) : null;

  const body = (
    <div className="space-y-4 px-4 py-5 md:px-6">
      {hasSent ? (
        <>
          <p className="text-text-subtle text-sm">{result?.message}</p>

          <div className="bg-bg-state-soft border-border-default text-text-subtle flex items-center gap-2.5 rounded-sm border px-3 py-2.5 text-sm">
            <Spinner className="text-icon-informative size-4" />
            <p>Sending is in progress. Login details go out over the next few minutes.</p>
          </div>

          {!!result?.skippedNoContact && (
            <div className="bg-bg-basic-orange-subtle border-border-default text-text-subtle shadow-light flex items-center gap-3 rounded-sm border px-2.5 py-2.5 text-sm">
              <WarningIcon />
              <p>
                {result.skippedNoContact} parent(s) have no email address or phone number and could not be reached. Add contact details to their
                records, then send again.
              </p>
            </div>
          )}

          {statusSummary}
        </>
      ) : (
        <>
          <p className="text-text-subtle text-sm">
            {description ??
              "Parents are not emailed automatically when they are added. Send their login details now, or send them later from the Parents tab."}
          </p>

          {!branchId && (
            <div className="space-y-2">
              <Label className="text-text-default text-sm font-medium">Branch</Label>
              {loadingBranches ? (
                <Skeleton className="bg-bg-input-soft h-9 w-full" />
              ) : (
                <Select onValueChange={value => setSelectedBranchId(Number(value))} value={selectedBranchId ? String(selectedBranchId) : undefined}>
                  <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                    <span className="text-text-default text-sm font-medium">
                      {selectableBranches.find(branch => branch.branch.id === selectedBranchId)?.branch.name ?? "Select a branch"}
                    </span>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-card border-border-default">
                    {selectableBranches.map((branch: BranchWithClassLevels) => (
                      <SelectItem key={branch.branch.id} value={String(branch.branch.id)} className="text-text-default text-sm font-medium">
                        {branch.branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {scopedToParents ? (
            <div className="bg-bg-state-soft border-border-default text-text-subtle rounded-sm border px-3 py-2.5 text-sm">
              Login details will be sent to <span className="text-text-default font-medium">{parentIds?.length}</span> parent(s).
            </div>
          ) : (
            statusSummary
          )}

          {nothingToSend && (
            <div className="bg-bg-basic-orange-subtle border-border-default text-text-subtle shadow-light flex items-center gap-3 rounded-sm border px-2.5 py-2.5 text-sm">
              <WarningIcon />
              <p>Every parent in this branch already has their login details. There is nothing to send.</p>
            </div>
          )}

          {requireConfirmation && (
            <div className="flex items-start gap-3">
              <Checkbox
                id="send-login-details"
                className="mt-0.5"
                checked={isChecked}
                onCheckedChange={(checked: boolean) => setIsChecked(checked)}
              />
              <label htmlFor="send-login-details" className="text-text-subtle text-sm font-normal">
                I want to send login details to parents who have not received them yet.
              </label>
            </div>
          )}
        </>
      )}
    </div>
  );

  const sendButton = (
    <Button
      disabled={!canSend}
      onClick={handleSend}
      className={`h-7 rounded-md px-2 py-1 text-sm font-medium ${
        canSend ? "bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default" : "bg-bg-state-soft text-text-subtle"
      }`}
    >
      {sending ? <Spinner className="text-text-white-default" /> : <SendPlaneFill fill="var(--color-icon-white-default)" className="size-4" />}
      <span>Send Now</span>
    </Button>
  );

  const doneButton = (
    <Button
      onClick={handleDone}
      className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 px-2 py-1 text-sm font-medium"
    >
      Done
    </Button>
  );

  const laterButton = (
    <Button
      variant="outline"
      onClick={handleLater}
      className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle hover:text-text-subtle! h-7 border-none px-2 py-1 text-sm font-medium"
    >
      {laterLabel}
    </Button>
  );

  if (isMobile) {
    return (
      <MobileDrawer open={open} setIsOpen={setOpen} title={title}>
        {body}
        <DrawerFooter className="border-border-default border-t">
          <div className="flex items-center justify-between gap-2">
            {hasSent ? <span /> : laterButton}
            {hasSent ? doneButton : sendButton}
          </div>
        </DrawerFooter>
      </MobileDrawer>
    );
  }

  return (
    <>
      <Modal
        open={open}
        setOpen={setOpen}
        className="block"
        title={
          <span className="flex items-center gap-2">
            <span className="bg-bg-state-soft flex size-8 items-center justify-center rounded-full">
              <Mail fill="var(--color-icon-default-subtle)" className="size-4" />
            </span>
            <span>{title}</span>
          </span>
        }
        cancelButton={hasSent ? <span /> : laterButton}
        ActionButton={hasSent ? doneButton : sendButton}
      >
        {body}
      </Modal>
    </>
  );
};
