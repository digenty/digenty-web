import React from "react";
import { Button } from "../ui/button";
import { AddFill } from "../Icons/AddFill";
import { QuickReferenceAll } from "../Icons/QuickReferenceAll";

export const ClassFees = () => {
  return (
    <div className="flex min-h-screen place-content-center place-items-center items-center justify-center">
      <div className="flex max-w-80 flex-col items-center gap-4">
        <QuickReferenceAll />
        <p className="text-text-default text-lg font-medium">Let’s set up your fees</p>
        <p className="text-text-muted text-center text-xs font-normal">
          You can add fees for one or more classes, branches and arms. We’ll guide you step-by step
        </p>
        <Button className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default rounded-sm px-4 py-2">
          <AddFill fill="var(--color-icon-white-default)" />
          Add First Fee
        </Button>
      </div>
    </div>
  );
};
