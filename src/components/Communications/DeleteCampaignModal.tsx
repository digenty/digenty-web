"use client";

import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { AlertFill } from "@digenty/icons";
import { useEffect, useState } from "react";

type DeleteCampaignModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onDelete: () => void;
  loading?: boolean;
};

const ModalContent = ({ acknowledged, setAcknowledged }: { acknowledged: boolean; setAcknowledged: (v: boolean) => void }) => (
  <div className="flex flex-col gap-4 p-4">
    <p className="text-text-default text-sm">Are you sure you want to permanently delete this campaign? This action cannot be undone.</p>

    <div className="bg-bg-basic-orange-subtle border-border-default flex gap-2.5 rounded-lg border p-3">
      <AlertFill className="mt-0.5 size-4 shrink-0" fill="var(--color-bg-basic-orange-accent)" />
      <p className="text-text-subtle text-sm">
        Deleting this campaign will remove all of its messages, schedules, and reports. It will no longer appear in your campaign list or analytics.
      </p>
    </div>

    <div className="flex items-start gap-2">
      <Checkbox id="delete-ack" checked={acknowledged} onCheckedChange={v => setAcknowledged(!!v)} className="mt-0.5 shrink-0" />
      <label htmlFor="delete-ack" className="text-text-default cursor-pointer text-sm">
        I understand that deleting this campaign is permanent and cannot be undone.
      </label>
    </div>
  </div>
);

export const DeleteCampaignModal = ({ open, setOpen, onDelete, loading = false }: DeleteCampaignModalProps) => {
  const isMobile = useIsMobile();
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (!open) setAcknowledged(false);
  }, [open]);

  const cancelBtn = (
    <Button
      type="button"
      disabled={loading}
      className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle h-7 w-fit border-none text-sm font-medium"
      onClick={() => setOpen(false)}
    >
      Cancel
    </Button>
  );

  const deleteBtn = (
    <Button
      type="button"
      disabled={!acknowledged || loading}
      onClick={onDelete}
      className="bg-bg-state-destructive hover:bg-bg-state-destructive-hover! h-7 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete Campaign"}
    </Button>
  );

  if (isMobile) {
    return (
      <MobileDrawer open={open} setIsOpen={setOpen} title="Delete Campaign?">
        <ModalContent acknowledged={acknowledged} setAcknowledged={setAcknowledged} />
        <DrawerFooter className="border-border-default border-t">
          <div className="flex items-center justify-between">
            <DrawerClose asChild>{cancelBtn}</DrawerClose>
            {deleteBtn}
          </div>
        </DrawerFooter>
      </MobileDrawer>
    );
  }

  return (
    <Modal open={open} setOpen={setOpen} title="Delete Campaign?" className="sm:max-w-md" cancelButton={cancelBtn} ActionButton={deleteBtn}>
      <ModalContent acknowledged={acknowledged} setAcknowledged={setAcknowledged} />
    </Modal>
  );
};
