"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export const WizardStepFooter = ({
  onBack,
  backDisabled,
  onContinue,
  continueDisabled,
  isLoading,
  continueLabel = "Continue",
  showContinueArrow = true,
}: {
  onBack?: () => void;
  backDisabled?: boolean;
  onContinue: () => void;
  continueDisabled?: boolean;
  isLoading?: boolean;
  continueLabel?: string;
  showContinueArrow?: boolean;
}) => {
  return (
    <div className="border-border-default bg-bg-default fixed right-0 bottom-0 left-0 z-10 flex justify-between border-t px-4 py-3 md:left-(--sidebar-w) lg:px-40">
      <Button
        type="button"
        onClick={onBack}
        disabled={backDisabled || !onBack}
        className="border-border-darker text-text-default flex h-9! items-center gap-1 rounded-full border bg-transparent! px-4 disabled:opacity-40"
      >
        <ChevronLeft className="size-4" /> Back
      </Button>

      <Button
        type="button"
        onClick={onContinue}
        disabled={continueDisabled}
        className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! flex h-9! items-center gap-1 rounded-full px-5"
      >
        {isLoading && <Spinner className="text-text-white-default size-4" />}
        {continueLabel} {showContinueArrow && <ChevronRight className="size-4" />}
      </Button>
    </div>
  );
};
