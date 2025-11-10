"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
type RequestEditProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function RequestEdit({ open, onOpenChange }: RequestEditProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="flex justify-center">
        <DialogContent className="border-border-default bg-bg-card fixed w-full rounded-md border p-0 shadow-sm md:w-133">
          <div className="bg-bg-card-subtle borber-border-default flex justify-between border-b px-4 py-3">
            <div className="text-text-default text-md font-semibold">Request edit access</div>
          </div>

          <div className="flex flex-col gap-5 px-6 py-4">
            <DialogDescription className="text-text-subtle mt-2 text-sm font-normal">
              Select why you need to edit. You can add details if helpful.
            </DialogDescription>

            <div className="flex flex-col gap-3">
              <Label className="text-text-default text-sm font-medium">
                Reason for edit <small className="text-text-destructive text-sm font-semibold">*</small>
              </Label>
              <div className="flex items-center gap-3">
                <Checkbox id="wrong-scores" className="" />
                <Label className="text-text-subtle text-sm font-normal">Wrong scores entered</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="wrong-scores" className="" />
                <Label className="text-text-subtle text-sm font-normal">Missing scores to add</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="wrong-scores" className="" />
                <Label className="text-text-subtle text-sm font-normal">Administrative directive</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="wrong-scores" className="" />
                <Label className="text-text-subtle text-sm font-normal">Others</Label>
              </div>
              <div className="mt-3">
                <Label className="text-text-default mb-2 block text-sm font-medium">
                  Input Reason <small className="text-text-destructive text-sm font-semibold">*</small>{" "}
                </Label>
                <Input
                  className="bg-bg-input-soft border-border-default text-text-subtle h-9 w-full rounded-md border p-2 text-sm font-normal"
                  placeholder="Input Reason"
                />
              </div>

              <div className="mt-3 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label className="text-text-default mb-2 block text-sm font-medium">Additional Details</Label>

                  <p className="text-text-muted text-sm font-normal">Optional</p>
                </div>

                <Input
                  className="bg-bg-input-soft border-border-default text-text-subtle h-25 w-full rounded-md border p-2 text-sm font-normal"
                  placeholder="Add brief context"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="border-border-default flex items-center justify-between border-t px-4 py-3">
            <Button
              variant="secondary"
              className="bg-bg-state-soft text-text-subtle rounded-sm px-2 py-1 text-sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => onOpenChange(false)} className="text-text-white-default bg-bg-state-primary rounded-sm px-2 py-1 text-sm">
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  );
}
