"use client";

import React from "react";
import FeeDetails from "./FeeDetails";
import { FeeBranch } from "./FeeBranch";
import FeesClassApplyTo from "./FeesClassApplyTo";
import FeeAmount from "./FeeAmount";
import { Button } from "@/components/ui/button";
import { FEES_STEPS, useFeesStep } from "./FeesSteps";
import { Badge } from "@/components/ui/badge";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

export const AddFee = () => {
  useBreadcrumb([
    { label: "Fees", url: "/fees" },
    { label: "Class Fees", url: "/fees" },
    { label: "Add fees", url: "/fees/add" },
  ]);

  const { step, goToStep } = useFeesStep();
  const stepIndex = FEES_STEPS.findIndex(s => s.key === step);

  const current = stepIndex + 1;
  const total = FEES_STEPS.length;

  return (
    <div className="">
      <div className="bg-bg-card-subtle border-border-default flex w-full items-center justify-between border-b p-3">
        <div className="text-text-default text-md mx-auto flex w-full font-semibold md:block md:max-w-150 md:items-center md:justify-center">
          Add Fees
        </div>
        <Badge className="text-text-subtle bg-bg-badge-default border-border-default block h-6 rounded-sm border p-1 md:hidden">
          {current}/{total}
        </Badge>
      </div>
      <div className="mx-auto my-4 hidden w-full md:block md:max-w-150">
        <div className="mx-3 mb-20 hidden flex-col gap-6 md:mx-0 md:flex">
          <FeeDetails />
          <FeeBranch />
          <FeesClassApplyTo />
          <FeeAmount />
        </div>

        {/* <div className="border-border-default border-t mx-auto bg-bg-default fixed px-4 bottom-0 left-0. right-0 w-full  border-b py-3"> */}
        <div className="border-border-default bg-bg-default fixed bottom-0 w-full max-w-150 border-t py-3 pr-8 pl-4 md:px-0">
          <div className="flex justify-between">
            <Button className="bg-bg-state-soft! text-text-subtle! hover:bg-bg-state-soft-hover! h-7! text-sm">Cancel</Button>
            <div className="flex items-center gap-2">
              <Button className="bg-bg-state-soft! text-text-subtle! hover:bg-bg-state-soft-hover! h-7! w-39! text-sm">Save & Add Another</Button>
              <Button className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-7! w-19!">Add Fee</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex md:hidden">
        <div className="w-full p-3">
          {step === "details" && <FeeDetails />}
          {step === "branch" && <FeeBranch />}
          {step === "classes" && <FeesClassApplyTo />}
          {step === "amount" && <FeeAmount />}
        </div>
        <div className="border-border-default bg-bg-default absolute right-0 bottom-0 left-0 z-20 mt-4 flex w-full justify-between gap-2 border-t p-2">
          {stepIndex > 0 && (
            <Button
              variant="outline"
              className="bg-bg-state-soft! text-text-subtle h-8! rounded-sm border-none px-2.5! py-1.5 text-sm"
              onClick={() => goToStep(FEES_STEPS[stepIndex - 1].key)}
            >
              Back
            </Button>
          )}
          <div>
            {" "}
            {stepIndex == 0 && <Button className="bg-bg-state-soft! text-text-subtle h-8! border-none px-2.5! py-1.5 text-sm">Cancel</Button>}
          </div>

          <div className="flex flex-row items-center justify-between">
            {stepIndex < FEES_STEPS.length - 1 ? (
              <div className="flex items-center justify-between gap-2">
                <Button
                  className="text-text-white-default bg-bg-state-primary! h-8! border-none px-2.5! py-1.5 text-sm"
                  onClick={() => goToStep(FEES_STEPS[stepIndex + 1].key)}
                >
                  Next
                </Button>
              </div>
            ) : (
              <Button className="text-text-white-default bg-bg-state-primary! h-8! border-none px-2.5! py-1.5 text-sm">Add Fee</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
