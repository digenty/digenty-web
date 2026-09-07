"use client";

import { AlertFill } from "@digenty/icons";
import { useState } from "react";

import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteExpense } from "@/hooks/queryHooks/useExpense";
import { useIsMobile } from "@/hooks/useIsMobile";

import { ExpenseListItem, expenseTitleOf } from "./types";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  expense: ExpenseListItem | null;
  onDeleted?: () => void;
};

export const DeleteExpenseModal = ({ open, setOpen, expense, onDeleted }: Props) => {
  const isMobile = useIsMobile();
  const [acknowledged, setAcknowledged] = useState(false);
  const { mutateAsync: removeExpense, isPending } = useDeleteExpense();

  const handleDelete = async () => {
    if (!expense?.id) return;
    try {
      await removeExpense(expense.id);
      toast({ title: "Expense deleted", type: "success" });
      setOpen(false);
      onDeleted?.();
    } catch (error) {
      const message = (error as { message?: string } | null)?.message ?? "Could not delete expense";
      toast({ title: message, type: "error" });
    }
  };

  const submitButton = (
    <Button
      type="button"
      onClick={handleDelete}
      disabled={isPending || !acknowledged}
      className="text-text-white-default bg-bg-state-destructive hover:bg-bg-state-destructive-hover! h-7! rounded-md px-2 py-1 text-sm disabled:opacity-50"
    >
      {isPending ? <Spinner /> : "Delete Expense"}
    </Button>
  );

  const title = expenseTitleOf(expense);

  const body = (
    <div className="flex w-full flex-col gap-5 px-4 py-5 md:px-6">
      <p className="text-text-subtle text-sm">
        Are you sure you want to permanently delete {title ? <span className="text-text-default font-medium">{title}</span> : "this expense"}? This
        action cannot be undone.
      </p>

      <div className="border-border-default bg-bg-basic-orange-subtle flex items-start gap-3 rounded-md border p-3">
        <AlertFill fill="var(--color-bg-basic-orange-accent)" className="mt-0.5 size-6 shrink-0" />
        <p className="text-text-subtle text-sm">
          Deleting this expense will remove it from your financial records and reports. It will no longer appear in expense history or summaries, and
          the record cannot be restored automatically.
        </p>
      </div>

      <label className="flex cursor-pointer items-start gap-3">
        <Checkbox
          checked={acknowledged}
          onCheckedChange={(value: boolean) => setAcknowledged(!!value)}
          aria-label="Acknowledge permanent deletion"
          className="mt-0.5"
        />
        <span className="text-text-subtle text-sm">I understand that deleting this expense is permanent and cannot be undone.</span>
      </label>
    </div>
  );

  return isMobile ? (
    <MobileDrawer open={open} setIsOpen={setOpen} title="Delete Expense?">
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
    <Modal open={open} setOpen={setOpen} title="Delete Expense?" ActionButton={submitButton}>
      {body}
    </Modal>
  );
};
