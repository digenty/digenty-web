"use client";

import { AlertFill, SendPlaneFill } from "@digenty/icons";

import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/useIsMobile";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: "publish" | "delete";
  count: number;
  isPending: boolean;
  onConfirm: () => void;
};

export const BulkFeeItemsModal = ({ open, setOpen, mode, count, isPending, onConfirm }: Props) => {
  const isMobile = useIsMobile();
  const isDelete = mode === "delete";
  const noun = `${count} fee item${count !== 1 ? "s" : ""}`;
  const title = isDelete ? "Delete Fee Items?" : "Publish Fee Items?";

  const submitButton = (
    <Button
      type="button"
      onClick={onConfirm}
      disabled={isPending}
      className={
        isDelete
          ? "text-text-white-default bg-bg-state-destructive hover:bg-bg-state-destructive-hover! h-7! rounded-md px-2 py-1 text-sm disabled:opacity-50"
          : "bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary-hover! h-7! rounded-md px-2 py-1 text-sm disabled:opacity-50"
      }
    >
      {isPending ? (
        <Spinner />
      ) : isDelete ? (
        `Delete ${noun}`
      ) : (
        <>
          <SendPlaneFill fill="var(--color-icon-white-default)" /> Publish {noun}
        </>
      )}
    </Button>
  );

  const body = (
    <div className="flex w-full flex-col gap-5 px-4 py-5 md:px-6">
      <p className="text-text-subtle text-sm">
        {isDelete ? (
          <>
            Are you sure you want to permanently delete <span className="text-text-default font-medium">{noun}</span>? This action cannot be undone.
          </>
        ) : (
          <>
            You are about to publish <span className="text-text-default font-medium">{noun}</span>. Published fees are billed to students and become
            visible to parents.
          </>
        )}
      </p>

      {isDelete && (
        <div className="border-border-default bg-bg-basic-orange-subtle flex items-start gap-3 rounded-md border p-3">
          <AlertFill fill="var(--color-bg-basic-orange-accent)" className="mt-0.5 size-6 shrink-0" />
          <p className="text-text-subtle text-sm">Fee items that have already been published or paid may not be deletable and will be skipped.</p>
        </div>
      )}
    </div>
  );

  return isMobile ? (
    <MobileDrawer open={open} setIsOpen={setOpen} title={title}>
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
    <Modal open={open} setOpen={setOpen} title={title} ActionButton={submitButton}>
      {body}
    </Modal>
  );
};
