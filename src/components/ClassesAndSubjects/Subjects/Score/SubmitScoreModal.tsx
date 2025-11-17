import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog } from "@radix-ui/react-dialog";
import React from "react";

type SubmitScoreModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function SubmitScoreModal({ open, onOpenChange }: SubmitScoreModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border-default bg-bg-card fixed w-full rounded-md border p-0 shadow-sm md:w-138">
        <DialogHeader className="bg-bg-card-subtle border-border-default rounded-t-xl border-b px-4 py-3 text-left">
          <DialogTitle className="text-text-default text-base font-semibold">Submit Subject Scores?</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-5 py-4">
          <DialogDescription className="text-text-subtle text-sm font-normal">
            Are you sure you want to submit the scores for Mathematics (SS2B)?
          </DialogDescription>

          <div className="border-border-default bg-bg-basic-blue-subtle rounded-sm border px-3 py-2">
            <p className="text-text-sublte text-sm font-normal">
              Once submitted, you will no longer be able to make changes. To edit later, you’ll need to request edit access from the class teacher or
              admin.
            </p>
          </div>
        </div>

        <DialogFooter className="border-border-default flex items-center justify-between border-t px-4 py-3">
          <Button variant="secondary" className="bg-bg-state-soft text-text-subtle rounded-sm px-2 py-1 text-sm">
            Cancel
          </Button>
          <Button className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! rounded-sm px-2 py-1 text-sm">
            Submit Scores
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
