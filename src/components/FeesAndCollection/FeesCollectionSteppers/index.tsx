"use client";

import React, { useState } from "react";
import { FeesMode } from "./FeesMode";
import { OneCollectionAccount } from "./FeesModeOneAccount/OneCollectionAccount";
import { OneFeesRouting } from "./FeesModeOneAccount/OneFeesRouting";

import Loader2Fill from "@/components/Icons/Loader2Fill";
import CheckboxCircleFill from "@/components/Icons/CheckboxCircleFill";
import { Button } from "@/components/ui/button";
import Information from "@/components/Icons/Information";
import { OneAccountReview } from "./FeesModeOneAccount/OneAccountReview";
import { DifferentFeesAccount } from "./FeesModeDifferentAccounts/DifferentFeesAccount";
import { DifferentFeesRounting } from "./FeesModeDifferentAccounts/DifferentFeesRounting";
import { DifferentFeesReview } from "./FeesModeDifferentAccounts/DifferentFeesReview";

type FlowType = "oneAccount" | "differentAccounts";

const steps = [{ label: "Choose Mode" }, { label: "Account Setup" }, { label: "Routing" }, { label: "Review" }];

export const FeesSetup = () => {
  const [activeStep, setActiveStep] = useState(-1);
  const [flow, setFlow] = useState<FlowType | null>(null);

  const next = () => setActiveStep(s => Math.min(s + 1, steps.length - 1));

  const prev = () => setActiveStep(s => Math.max(s - 1, 0));

  const renderStepIndicator = (index: number) => {
    if (index < activeStep) {
      return <CheckboxCircleFill fill="var(--color-icon-success)" />;
    }
    if (index === activeStep) {
      return <Loader2Fill fill="var(--color-icon-informative)" />;
    }
    return (
      <div className="border-border-default text-text-default flex h-6 w-6 items-center justify-center rounded-full border text-sm font-medium">
        {index + 1}
      </div>
    );
  };

  return (
    <div className="mx-auto flex items-center justify-center p-3">
      <div className="flex w-full max-w-175 flex-col gap-8">
        <div className="bg-bg-card border-border-default relative flex w-full items-center rounded-md border p-4">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;

            return (
              <div key={step.label} className="relative flex w-full flex-1 flex-col items-start">
                {!isLast && <div className="border-border-default absolute top-2.5 left-1/9 h-0.5 w-xs border-b" />}

                <div className="relative z-10">{renderStepIndicator(index)}</div>

                <span className="text-md text-text-default mt-4 font-medium">{step.label}</span>
              </div>
            );
          })}
        </div>

        <div className="bg-bg-card border-border-default flex flex-col gap-8 rounded-md border">
          <div className="px-6 pt-6">
            {activeStep === -1 && <FeesMode selected={flow} onSelect={value => setFlow(value)} />}
            {activeStep === 0 && flow === "oneAccount" && <OneCollectionAccount />}
            {activeStep === 1 && flow === "oneAccount" && (
              <div>
                <div className="flex flex-col gap-8">
                  <div className="">
                    <div className="text-text-default text-lg font-semibold">Do any fees need a different account?</div>
                    <div className="text-text-muted text-sm font-normal">
                      By default, all fees go to the school&apos;s collection account. Only choose a fee if it should be collected separately.
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 md:flex-row">
                    <Button className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-10! w-full rounded-md text-center md:w-80!">
                      Skip for now
                    </Button>
                    <Button className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! text-text-subtle h-10! w-full rounded-md md:w-80!">
                      Set up fee routing
                    </Button>
                  </div>
                  <div className="bg-bg-basic-gray-subtle flex h-10 w-full items-center gap-2 rounded-md p-3">
                    <Information fill="var(--color-icon-default)" />
                    <div className="text-text-subtle text-xs">You can set this up later in fee collection</div>
                  </div>
                </div>
              </div>
            )}
            {activeStep === 2 && flow === "oneAccount" && <OneFeesRouting />}
            {activeStep === 3 && flow === "oneAccount" && <OneAccountReview />}

            {activeStep === 0 && flow === "differentAccounts" && <DifferentFeesAccount />}
            {activeStep === 1 && flow === "differentAccounts" && (
              <div>
                <div className="flex flex-col gap-8">
                  <div className="">
                    <div className="text-text-default text-lg font-semibold">Do any fees need a different account?</div>
                    <div className="text-text-muted text-sm font-normal">
                      By default, all fees go to the school&apos;s collection account. Only choose a fee if it should be collected separately.
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 md:flex-row">
                    <Button className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-10! w-full rounded-md text-center md:w-80!">
                      Skip for now
                    </Button>
                    <Button className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! text-text-subtle h-10! w-full rounded-md md:w-80!">
                      Set up fee routing
                    </Button>
                  </div>
                  <div className="bg-bg-basic-gray-subtle flex h-10 w-full items-center gap-2 rounded-md p-3">
                    <Information fill="var(--color-icon-default)" />
                    <div className="text-text-subtle text-xs">You can set this up later in fee collection</div>
                  </div>
                </div>
              </div>
            )}
            {activeStep === 2 && flow === "differentAccounts" && <DifferentFeesRounting />}
            {activeStep === 3 && flow === "differentAccounts" && (
              <DifferentFeesReview
                selected={flow}
                onSelect={(value: FlowType) => {
                  setFlow(value);
                  setActiveStep(0);
                }}
              />
            )}
          </div>

          <div className="border-border-default border-t">
            <div className="flex justify-between p-6">
              <Button
                onClick={prev}
                disabled={activeStep === -1}
                className="bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-subtle h-9! rounded-md text-sm"
              >
                Previous
              </Button>

              <Button
                onClick={next}
                disabled={activeStep === -1 && !flow}
                className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-9! rounded-md text-sm"
              >
                {activeStep === steps.length - 1 ? "Finish" : "Continue"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
