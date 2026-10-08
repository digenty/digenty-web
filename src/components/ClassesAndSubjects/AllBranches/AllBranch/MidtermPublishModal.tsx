"use client";

import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { usePublishMidtermReport, useUnpublishMidtermReport } from "@/hooks/queryHooks/useMidterm";
import { usePublishBranchReports, useUnpublishBranchReports } from "@/hooks/queryHooks/useReportPublish";
import { useIsMobile } from "@/hooks/useIsMobile";
import { format } from "date-fns";
import { useState } from "react";

type MidtermPublishModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  branchId: number;
  branchName: string;
  mode: "publish" | "unpublish";
  /** Which report this acts on. They publish independently of each other. */
  report?: "midterm" | "term";
  termId?: number;
};

const errorMessage = (error: unknown, fallback: string) => (error as { message?: string } | null)?.message || fallback;

// Publishes (or hides) the mid-term report for every class in a branch. It is separate from the term report:
// neither action touches the other. Error messages from the API are written to be shown as they come.
export const MidtermPublishModal = ({ open, setOpen, branchId, branchName, mode, termId, report = "midterm" }: MidtermPublishModalProps) => {
  const isMobile = useIsMobile();
  const [asOfDate, setAsOfDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const { mutate: publish, isPending: isPublishing } = usePublishMidtermReport();
  const { mutate: unpublish, isPending: isUnpublishing } = useUnpublishMidtermReport();

  const { mutate: publishTerm, isPending: isPublishingTerm } = usePublishBranchReports();
  const { mutate: unpublishTerm, isPending: isUnpublishingTerm } = useUnpublishBranchReports();

  const isTerm = report === "term";
  const label = isTerm ? "Term Report" : "Mid-term Report";
  const isPublish = mode === "publish";
  const isPending = isPublishing || isUnpublishing || isPublishingTerm || isUnpublishingTerm;

  const handleConfirm = () => {
    if (isTerm) {
      const action = isPublish ? publishTerm : unpublishTerm;
      action(
        { branchId, termId },
        {
          onSuccess: () => {
            toast({
              title: isPublish ? "Term report published" : "Term report unpublished",
              description: isPublish ? `Results are now visible to parents in ${branchName}.` : `Parents in ${branchName} can no longer see results.`,
              type: "success",
            });
            setOpen(false);
          },
          onError: error => {
            toast({
              title: isPublish ? "Could not publish" : "Could not unpublish",
              description: errorMessage(error, "Something went wrong"),
              type: "error",
            });
          },
        },
      );
      return;
    }

    if (isPublish) {
      publish(
        { branchId, termId, asOfDate: asOfDate || undefined },
        {
          onSuccess: res => {
            const count = res?.data?.publishedCount;
            toast({
              title: "Mid-term report published",
              description: count != null ? `Published for ${count} ${count === 1 ? "class" : "classes"} in ${branchName}.` : undefined,
              type: "success",
            });
            setOpen(false);
          },
          onError: error => {
            toast({ title: "Could not publish", description: errorMessage(error, "Failed to publish mid-term report"), type: "error" });
          },
        },
      );
      return;
    }

    unpublish(
      { branchId, termId },
      {
        onSuccess: () => {
          toast({ title: "Mid-term report unpublished", description: `Parents in ${branchName} can no longer see it.`, type: "success" });
          setOpen(false);
        },
        onError: error => {
          toast({ title: "Could not unpublish", description: errorMessage(error, "Failed to unpublish mid-term report"), type: "error" });
        },
      },
    );
  };

  const title = `${isPublish ? "Publish" : "Unpublish"} ${label}`;
  const actionLabel = isPublish ? "Publish" : "Unpublish";

  const body = (
    <div className="flex flex-col gap-5 px-5 py-4">
      <DialogDescription className="text-text-subtle text-sm font-normal">
        {isTerm
          ? isPublish
            ? `This publishes the term report for every approved class in ${branchName}. Parents will be able to see results.`
            : `This hides the term report from parents in ${branchName}. The mid-term report is not affected.`
          : isPublish
            ? `This publishes the mid-term report for every class in ${branchName} that has mid-term assessments. Parents are notified for classes published for the first time. The term report is not affected.`
            : `This hides the mid-term report from parents in ${branchName}. The term report is not affected, and the as-of date is cleared.`}
      </DialogDescription>
      {isPublish && !isTerm && (
        <div className="space-y-2">
          <Label htmlFor="midterm-as-of" className="text-text-default text-sm font-medium">
            Count attendance up to
          </Label>
          <Input
            id="midterm-as-of"
            type="date"
            value={asOfDate}
            onChange={e => setAsOfDate(e.target.value)}
            className="bg-bg-input-soft! text-text-default border-none text-sm font-normal"
          />
          <p className="text-text-muted text-xs">Defaults to today. It cannot be before the start of the term.</p>
        </div>
      )}
    </div>
  );

  const actionButton = (
    <Button
      onClick={handleConfirm}
      disabled={isPending}
      className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm"
    >
      {isPending && <Spinner className="text-text-white-default" />}
      {actionLabel}
    </Button>
  );

  if (!isMobile) {
    return (
      <Modal open={open} setOpen={setOpen} className="block" title={title} ActionButton={actionButton}>
        {body}
      </Modal>
    );
  }

  return (
    <MobileDrawer open={open} setIsOpen={setOpen} title={title}>
      {body}
      <DrawerFooter className="border-border-default border-t">
        <div className="flex justify-between">
          <DrawerClose asChild>
            <Button className="bg-bg-state-soft text-text-subtle h-7 rounded-md! px-2 py-2 text-sm font-medium">Cancel</Button>
          </DrawerClose>
          {actionButton}
        </div>
      </DrawerFooter>
    </MobileDrawer>
  );
};
