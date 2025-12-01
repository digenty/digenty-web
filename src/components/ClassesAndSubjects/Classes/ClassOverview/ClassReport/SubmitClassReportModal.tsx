import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";

import React from "react";

type SubmitScoreModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const SubmitClassReportModal = ({ open, onOpenChange }: SubmitScoreModalProps) => {
  return (
    <>
      <Modal
        open={open}
        setOpen={onOpenChange}
        // className="block"
        title="Submit Class Report?"
        ActionButton={
          <Button
            onClick={() => onOpenChange(false)}
            className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm"
          >
            Submit Class Report
          </Button>
        }
      >
        <div className="flex flex-col gap-4 px-5 py-4">
          <DialogDescription className="text-text-subtle text-sm font-normal">Are you sure you want to submit the class report?</DialogDescription>

          <div className="border-border-default bg-bg-basic-blue-subtle rounded-sm border px-3 py-2">
            <p className="text-text-subtle text-sm font-normal">
              You will no longer be able to make changes. To make edits after submission, you will need to request edit access from the admin.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};
