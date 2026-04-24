import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DrawerClose } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/useIsMobile";
import React from "react";

type Returnmodalprops = {
  openReturnModal: boolean;
  setOpenReturnModal: (openReturnModal: boolean) => void;
  classArmName: string;
  onConfirm: () => void;
  isSubmitting: boolean;
  returnReason: string;
  setReturnReason: (returnReason: string) => void;
};

export const ReturnModal = ({
  openReturnModal,
  setOpenReturnModal,
  classArmName,
  onConfirm,
  isSubmitting,
  returnReason,
  setReturnReason,
}: Returnmodalprops) => {
  const isMobile = useIsMobile();
  return (
    <>
      <div className="block md:hidden">
        {isMobile && (
          <MobileDrawer open={openReturnModal} setIsOpen={setOpenReturnModal} title="Return Results for Correction?">
            <div className="flex flex-col gap-5 px-6 py-4">
              <DialogDescription className="text-text-subtle text-sm font-normal">
                Are you sure you want to return the results for {classArmName} to the class teacher?
              </DialogDescription>

              <div className="mt-3 flex flex-col gap-2">
                <div className="text-text-subtle border-border-default bg-bg-basic-orange-subtle rounded-md border px-3 py-2.5 text-sm shadow-sm">
                  Once returned, the report will be unlocked for editing, and the class teacher will be notified to make corrections. You’ll need to
                  re-approve once the updated report is submitted.
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-text-muted" htmlFor="reason">
                  Reason for Returning
                </Label>
                <Textarea
                  id="reason"
                  className="bg-bg-input-soft! text-text-muted rounded-md p-3 text-sm"
                  rows={4}
                  value={returnReason}
                  onChange={e => setReturnReason(e.target.value)}
                  placeholder="Enter the reason for returning"
                />
              </div>
            </div>

            <div className="border-border-default border-t">
              <DialogFooter className="flex justify-between px-6 py-4">
                <DrawerClose asChild>
                  <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
                </DrawerClose>
                <Button
                  onClick={onConfirm}
                  disabled={isSubmitting}
                  className="text-text-white-default bg-bg-state-destructive hover:bg-bg-state-destructive/90! h-7! rounded-md px-2 py-1 text-sm"
                >
                  {isSubmitting ? (
                    <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Return for Correction"
                  )}
                </Button>
              </DialogFooter>
            </div>
          </MobileDrawer>
        )}
      </div>
      {!isMobile && (
        <Modal
          open={openReturnModal}
          setOpen={setOpenReturnModal}
          className="hidden md:block"
          title="Return Results for Correction?"
          ActionButton={
            <Button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="text-text-white-default bg-bg-state-destructive hover:bg-bg-state-destructive/90! h-7! rounded-md px-2 py-1 text-sm"
            >
              {isSubmitting ? (
                <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Return for Correction"
              )}
            </Button>
          }
        >
          <div className="flex flex-col gap-5 px-6 py-4">
            <DialogDescription className="text-text-subtle text-sm font-normal">
              Are you sure you want to return the results for {classArmName} to the class teacher?
            </DialogDescription>

            <div className="mt-3 flex flex-col gap-2">
              <div className="text-text-subtle border-border-default bg-bg-basic-orange-subtle rounded-md border px-3 py-2.5 text-sm shadow-sm">
                Once returned, the report will be unlocked for editing, and the class teacher will be notified to make corrections. You’ll need to
                re-approve once the updated report is submitted.
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-text-muted" htmlFor="reason">
                Reason for Returning
              </Label>
              <Textarea
                id="reason"
                className="bg-bg-input-soft! text-text-muted rounded-md p-3 text-sm"
                rows={4}
                value={returnReason}
                onChange={e => setReturnReason(e.target.value)}
                placeholder="Enter the reason for returning"
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
