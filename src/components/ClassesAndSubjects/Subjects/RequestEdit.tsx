"use client";

import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { RoundedCheckbox } from "../../RoundedCheckbox";

type RequestEditProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const reasons = ["Wrong scores entered", "Missing scores to add", "Administrative directive", "Others"];

export default function RequestEdit({ open, onOpenChange }: RequestEditProps) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  const handleToggle = (reason: string, isChecked: boolean) => {
    setSelectedReasons(prev => (isChecked ? [...prev, reason] : prev.filter(r => r !== reason)));
  };

  return (
    <Modal
      open={open}
      setOpen={onOpenChange}
      className="block"
      title="Request edit access"
      ActionButton={
        <Button
          onClick={() => onOpenChange(false)}
          className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm"
        >
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
                checked={selectedReasons.includes(reason)}
                onChange={isChecked => handleToggle(reason, isChecked)}
                color="bg-bg-state-primary"
              />
              <Label className="text-text-subtle text-sm font-normal">{reason}</Label>
            </div>
          ))}

          <div className="mt-3">
            <Label className="text-text-default mb-2 block text-sm font-medium">
              Input Reason <small className="text-text-destructive text-sm font-semibold">*</small>
            </Label>
            <Input
              className="bg-bg-input-soft! text-text-muted h-9 w-full rounded-md border-none p-2 text-sm font-normal"
              placeholder="Input Reason"
            />
          </div>

          <div className="mt-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-text-default text-sm font-medium">Additional Details</Label>
              <p className="text-text-muted text-sm font-normal">Optional</p>
            </div>

            <Textarea
              className="bg-bg-input-soft! text-text-muted flex h-18 w-full items-start rounded-md border-none p-2 text-sm font-normal"
              placeholder="Add brief context"
            />
          </div>
        </div>
      </div>
    </Modal>

    // <Dialog open={open} onOpenChange={onOpenChange}>
    //   <div className="flex justify-center">
    //     <DialogContent className="border-border-default bg-bg-card fixed w-full border p-0 shadow-sm md:w-133">
    //       <DialogHeader className="bg-bg-card-subtle border-border-default rounded-t-xl border-b px-4 py-3 text-left">
    //         <DialogTitle className="text-text-default text-base font-semibold">Request edit access</DialogTitle>
    //       </DialogHeader>

    //       <div className="flex flex-col gap-5 px-6 py-4">
    //         <DialogDescription className="text-text-subtle text-sm font-normal">
    //           Select why you need to edit. You can add details if helpful.
    //         </DialogDescription>

    //         <div className="flex flex-col gap-3">
    //           <Label className="text-text-default text-sm font-medium">
    //             Reason for edit <small className="text-text-destructive text-sm font-semibold">*</small>
    //           </Label>

    //           {reasons.map(reason => (
    //             <div key={reason} className="flex items-center gap-3">
    //               <RoundedCheckbox
    //                 checked={selectedReasons.includes(reason)}
    //                 onChange={isChecked => handleToggle(reason, isChecked)}
    //                 color="bg-bg-state-primary"
    //               />
    //               <Label className="text-text-subtle text-sm font-normal">{reason}</Label>
    //             </div>
    //           ))}

    //           <div className="mt-3">
    //             <Label className="text-text-default mb-2 block text-sm font-medium">
    //               Input Reason <small className="text-text-destructive text-sm font-semibold">*</small>
    //             </Label>
    //             <Input
    //               className="bg-bg-input-soft text-text-muted h-9 w-full rounded-md border-none p-2 text-sm font-normal"
    //               placeholder="Input Reason"
    //             />
    //           </div>

    //           <div className="mt-3 flex flex-col gap-2">
    //             <div className="flex items-center justify-between">
    //               <Label className="text-text-default text-sm font-medium">Additional Details</Label>
    //               <p className="text-text-muted text-sm font-normal">Optional</p>
    //             </div>

    //             <Textarea
    //               className="bg-bg-input-soft text-text-muted flex h-18 w-full items-start rounded-md border-none p-2 text-sm font-normal"
    //               placeholder="Add brief context"
    //             />
    //           </div>
    //         </div>
    //       </div>

    //       <DialogFooter className="border-border-default flex items-center justify-between border-t px-4 py-3">
    //         <Button
    //           variant="secondary"
    //           className="bg-bg-state-soft text-text-subtle rounded-sm px-2 py-1 text-sm"
    //           onClick={() => onOpenChange(false)}
    //         >
    //           Cancel
    //         </Button>
    //         <Button
    //           onClick={() => onOpenChange(false)}
    //           className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! rounded-sm px-2 py-1 text-sm"
    //         >
    //           Send Request
    //         </Button>
    //       </DialogFooter>
    //     </DialogContent>
    //   </div>
    // </Dialog>
  );
}
