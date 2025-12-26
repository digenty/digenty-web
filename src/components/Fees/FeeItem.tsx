import React from "react";
import { Button } from "../ui/button";
import { AddFill } from "../Icons/AddFill";
import { QuickReferenceAll } from "../Icons/QuickReferenceAll";

export const FeeItem = () => {
  return (
    <div className="flex min-h-screen place-content-center place-items-center items-center justify-center">
      <div className="flex max-w-80 flex-col items-center gap-4">
        <QuickReferenceAll />
        <p className="text-text-default text-lg font-medium">No Fees Created</p>
        <p className="text-text-muted text-center text-xs font-normal">
          Add fees here to start managing tuition, exams, levies, or other charges for your classes.
        </p>
        <Button className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default rounded-sm px-4 py-2">
          <AddFill fill="var(--color-icon-white-default)" />
          Add First Fee
        </Button>
      </div>
    </div>
  );
};
