"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { useState } from "react";
import { MobileDrawer } from "../MobileDrawer";
import { Modal } from "../Modal";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useGetUserProfile } from "@/hooks/queryHooks/useProfile";
import { useGetSchoolDetails } from "@/hooks/queryHooks/useSchool";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store";

interface OnboardingStepsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const OnboardingStepsModal = ({ open, setOpen }: OnboardingStepsModalProps) => {
  const isMobile = useIsMobile();
  const { data } = useGetSchoolDetails();
  const router = useRouter();
  const { steps } = useOnboardingStore();

  // TODO: Get onboarding steps completed from API.

  const completedStepsCount = steps.filter(s => s.isCompleted).length;
  const progressPercentage = (completedStepsCount / steps.length) * 100;
  const isStep1Completed = steps.find(s => s.id === 1)?.isCompleted ?? false;

  const title = (
    <div className="flex flex-col gap-1 py-1">
      <h2 className="text-text-default text-lg leading-tight font-semibold">
        Hi {data?.data?.firstName ? data?.data?.firstName.split(" ")[0] : "there"}, let&apos;s set up {data?.data?.schoolName || "your school"}
      </h2>
      <p className="text-text-muted text-sm font-normal">Complete the following setup checklist and you&apos;ll be ready to manage your school</p>
    </div>
  );

  const content = (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6">
      <div>{title}</div>
      {/* Progress Bar */}
      <div className="bg-bg-muted relative h-1 w-full overflow-hidden rounded-full">
        <div className="bg-bg-basic-green-accent h-full transition-all duration-500 ease-in-out" style={{ width: `${progressPercentage}%` }} />
      </div>

      {/* Steps List */}
      <div className="flex flex-col gap-3">
        {steps.map(step => (
          <div
            key={step.id}
            className={cn(
              "border-border-default flex items-center justify-between rounded-xl border px-3 py-4 transition-colors focus:outline-none",
              step.isCompleted ? "bg-bg-card" : "bg-bg-card hover:bg-bg-subtle",
            )}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-start gap-4">
              <div className="flex flex-shrink-0 pt-0.5">
                {step.isCompleted ? (
                  <CheckCircle2 className="size-4 text-green-500" />
                ) : (
                  <div className="border-border-strong text-text-muted flex size-4 items-center justify-center rounded-full border text-xs font-medium">
                    {step.id}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-text-default text-sm leading-none font-medium">{step.title}</h3>
                <p className="text-text-subtle text-sm leading-normal font-normal">{step.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {step.isCompleted && <span className="hidden text-sm font-medium text-green-500 md:inline">Completed</span>}
              {!step.isCompleted && (
                <Button
                  onClick={() => {
                    router.push(step.link!);
                    setOpen(false);
                  }}
                >
                  <ChevronRight className="text-icon-default-muted size-5" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <MobileDrawer open={open} setIsOpen={setOpen} showCloseButton={isStep1Completed} className="max-h-170 overflow-y-auto">
        {content}
      </MobileDrawer>
    );
  }

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      showCloseButton={isStep1Completed}
      className="max-h-170 overflow-y-auto sm:max-w-160 md:max-w-180"
      showFooter={false}
    >
      {content}
    </Modal>
  );
};
