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
import { Textarea } from "@/components/ui/textarea";
import { useRequestEditAccess } from "@/hooks/queryHooks/useClass";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useState } from "react";
import { RoundedCheckbox } from "../../RoundedCheckbox";

type RequestEditProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  armId?: number;
  classId?: number;
  subjectId?: number;
};

const reasons = ["Wrong scores entered", "Missing scores to add", "Administrative directive", "Others"];

export default function RequestEdit({ open, onOpenChange, classId, armId, subjectId }: RequestEditProps) {
  const [selectedReason, setSelectedReason] = useState<string>();
  const [inputReason, setInputReason] = useState<string>();
  const [additionalDetails, setAdditionalDetails] = useState<string>();

  const { mutate, isPending } = useRequestEditAccess();
  const isMobile = useIsMobile();

  const handleToggle = (reason: string) => {
    if (reason !== "Others") {
      setInputReason("");
    }
    setSelectedReason(reason);
  };

  const submitRequest = async () => {
    await mutate(
      {
        reason: selectedReason === "Others" ? inputReason : selectedReason,
        additionalDetails,
        armId,
        classId,
        subjectId,
      },
      {
        onSuccess: data => {
          onOpenChange(false);
          toast({
            title: "Request sent successfully",
            description: data.message,
            type: "success",
          });
        },
        onError: error => {
          toast({
            title: "Request failed",
            description: error.message,
            type: "error",
          });
        },
      },
    );
  };

  return (
    <>
      {!isMobile ? (
        <Modal
          open={open}
          setOpen={onOpenChange}
          title="Request edit access"
          ActionButton={
            <Button
              onClick={() => submitRequest()}
              className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm"
            >
              {isPending && <Spinner className="text-text-white-default" />}
              Submit Request
            </Button>
          }
        >
          <div className="flex flex-col gap-5 px-6 py-4">
            <DialogDescription className="text-text-subtle text-sm font-normal">
              Select why you need to edit. You can add details if helpful.
            </DialogDescription>

            <div className="flex flex-col gap-3">
              <Label className="text-text-default text-sm font-medium">
                Reason for edit <small className="text-text-destructive text-sm font-semibold">*</small>
              </Label>

              {reasons.map(reason => (
                <div key={reason} className="flex items-center gap-3">
                  <RoundedCheckbox
                    checked={selectedReason === reason}
                    onChange={() => {
                      handleToggle(reason);
                    }}
                    color="bg-bg-state-primary"
                  />
                  <Label className="text-text-default text-sm font-normal">{reason}</Label>
                </div>
              ))}

              {selectedReason === "Others" && (
                <div className="mt-3">
                  <Label className="text-text-default mb-2 block text-sm font-medium">
                    Input Reason <small className="text-text-destructive text-sm font-semibold">*</small>
                  </Label>
                  <Input
                    className="bg-bg-input-soft! text-text-muted h-9 w-full rounded-md border-none p-2 text-sm font-normal"
                    placeholder="Input Reason"
                    onChange={e => setInputReason(e.target.value)}
                  />
                </div>
              )}

              <div className="mt-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-text-default text-sm font-medium">Additional Details</Label>
                  <p className="text-text-muted text-sm font-normal">Optional</p>
                </div>

                <Textarea
                  className="bg-bg-input-soft! text-text-muted flex h-18 w-full items-start rounded-md border-none p-2 text-sm font-normal"
                  placeholder="Add brief context"
                  onChange={e => setAdditionalDetails(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Modal>
      ) : (
        <MobileDrawer open={open} setIsOpen={onOpenChange} className="block md:hidden" title="Request edit access">
          <div className="flex flex-col gap-5 px-6 py-4">
            <DialogDescription className="text-text-subtle text-sm font-normal">
              Select why you need to edit. You can add details if helpful.
            </DialogDescription>

            <div className="flex flex-col gap-3">
              <Label className="text-text-default text-sm font-medium">
                Reason for edit <small className="text-text-destructive text-sm font-semibold">*</small>
              </Label>

              {reasons.map(reason => (
                <div key={reason} className="flex items-center gap-3">
                  <RoundedCheckbox checked={selectedReason === reason} onChange={() => handleToggle(reason)} color="bg-bg-state-primary" />
                  <Label className="text-text-default text-sm font-normal">{reason}</Label>
                </div>
              ))}

              {selectedReason === "Others" && (
                <div className="mt-3">
                  <Label className="text-text-default mb-2 block text-sm font-medium">
                    Input Reason <small className="text-text-destructive text-sm font-semibold">*</small>
                  </Label>
                  <Input
                    className="bg-bg-input-soft! text-text-muted h-9 w-full rounded-md border-none p-2 text-sm font-normal"
                    placeholder="Input Reason"
                    onChange={e => setInputReason(e.target.value)}
                  />
                </div>
              )}

              <div className="mt-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-text-default text-sm font-medium">Additional Details</Label>
                  <p className="text-text-muted text-sm font-normal">Optional</p>
                </div>

                <Textarea
                  className="bg-bg-input-soft! text-text-muted flex h-18 w-full items-start rounded-md border-none p-2 text-sm font-normal"
                  placeholder="Add brief context"
                  onChange={e => setAdditionalDetails(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle hover:text-text-subtle h-7 border-none px-2 py-1 text-sm font-medium"
                >
                  Cancel
                </Button>
              </DrawerClose>

              <Button
                onClick={() => submitRequest()}
                className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm"
              >
                {isPending && <Spinner className="text-text-white-default" />}
                Submit Request
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      )}
    </>
  );
}
