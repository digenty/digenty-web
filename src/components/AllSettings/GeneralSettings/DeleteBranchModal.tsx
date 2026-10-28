"use client";

import { AlertFill } from "@digenty/icons";
import { useEffect, useState } from "react";

import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteBranch } from "@/hooks/queryHooks/useBranch";
import { useIsMobile } from "@/hooks/useIsMobile";
import { getApiErrorReason } from "@/lib/apiError";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  branchId: number | null;
  branchName?: string;
  onDeleted?: () => void;
};

export const DeleteBranchModal = ({ open, setOpen, branchId, branchName, onDeleted }: Props) => {
  const isMobile = useIsMobile();
  const [acknowledged, setAcknowledged] = useState(false);
  const { mutateAsync: removeBranch, isPending } = useDeleteBranch();

  useEffect(() => {
    if (!open) setAcknowledged(false);
  }, [open]);

  const handleDelete = async () => {
    if (!branchId) return;
    try {
      await removeBranch(branchId);
      toast({ title: "Branch deleted", type: "success" });
      setOpen(false);
      onDeleted?.();
    } catch (error) {
      toast({ title: "Could not delete branch", description: getApiErrorReason(error), type: "error" });
    }
  };

  const submitButton = (
    <Button
      type="button"
      onClick={handleDelete}
      disabled={isPending || !acknowledged}
      className="text-text-white-default bg-bg-state-destructive hover:bg-bg-state-destructive-hover! h-7! rounded-md px-2 py-1 text-sm disabled:opacity-50"
    >
      {isPending ? <Spinner /> : "Delete Branch"}
    </Button>
  );

  const body = (
    <div className="flex w-full flex-col gap-5 px-4 py-5 md:px-6">
      <p className="text-text-subtle text-sm">
        Are you sure you want to delete {branchName ? <span className="text-text-default font-medium">{branchName}</span> : "this branch"}? This
        action cannot be undone.
      </p>

      <div className="border-border-default bg-bg-basic-orange-subtle flex items-start gap-3 rounded-md border p-3">
        <AlertFill fill="var(--color-bg-basic-orange-accent)" className="mt-0.5 size-6 shrink-0" />
        <p className="text-text-subtle text-sm">
          Deleting this branch may remove its classes, students, staff assignments and related records from your school. Make sure nothing in this
          branch is still needed before you continue.
        </p>
      </div>

      <label className="flex cursor-pointer items-start gap-3">
        <Checkbox
          checked={acknowledged}
          onCheckedChange={(value: boolean) => setAcknowledged(!!value)}
          aria-label="Acknowledge permanent deletion"
          className="mt-0.5"
        />
        <span className="text-text-subtle text-sm">I understand that deleting this branch is permanent and cannot be undone.</span>
      </label>
    </div>
  );

  return isMobile ? (
    <MobileDrawer open={open} setIsOpen={setOpen} title="Delete Branch?">
      {body}
      <DrawerFooter className="border-border-default border-t">
        <div className="flex justify-between">
          <DrawerClose asChild>
            <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-2 py-1 text-sm font-medium">Cancel</Button>
          </DrawerClose>
          {submitButton}
        </div>
      </DrawerFooter>
    </MobileDrawer>
  ) : (
    <Modal open={open} setOpen={setOpen} title="Delete Branch?" ActionButton={submitButton}>
      {body}
    </Modal>
  );
};
