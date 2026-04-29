"use client";

import { useGetOnboardingProgress } from "@/hooks/queryHooks/useSchool";
import { JWTPayload } from "@/types";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import OnboardingModal from "./OnBoardingModal";
import { OnboardingStepsModal } from "./OnboardingStepsModal";
import { OnboardingStepsType } from "@/api/types";
import { useOnboardingStore } from "@/store";

interface OnboardingFlowProps {
  user: Partial<JWTPayload> | null;
}

export const OnboardingFlow = ({ user }: OnboardingFlowProps) => {
  const pathname = usePathname();
  const { data: progressResp, isLoading: isProgressLoading } = useGetOnboardingProgress();

  // If no schoolId, we show the onboarding modal
  const showOnboardingModal = !user?.schoolId;

  const apiSteps = progressResp?.data?.steps || [];

  const areRequiredStepsCompleted = [1, 2, 3, 4].every(id => {
    const apiStep = apiSteps.find((step: OnboardingStepsType) => step.stepNumber === id);
    return apiStep?.completed ?? false;
  });

  const { showSetupSteps, setShowSetupSteps } = useOnboardingStore();

  useEffect(() => {
    // Only auto-open if we have a schoolId and progress has finished loading
    if (user?.schoolId && !isProgressLoading) {
      // const isSetupPage = pathname.includes("/settings") || pathname.includes("/student-and-parent-record");
      const isSetupPage = pathname.includes("/settings");

      // Auto-open if required steps are not completed AND it's not a setup page AND it's currently closed
      if (!areRequiredStepsCompleted && !isSetupPage && !showSetupSteps) {
        setShowSetupSteps(true);
      }
    }
  }, [user?.schoolId, isProgressLoading, areRequiredStepsCompleted, pathname, setShowSetupSteps]);

  return (
    <>
      {showOnboardingModal && <OnboardingModal initialShow={showOnboardingModal} />}
      {!showOnboardingModal && showSetupSteps && user?.isMain && (
        <OnboardingStepsModal open={showSetupSteps} setOpen={setShowSetupSteps} apiSteps={apiSteps} />
      )}
    </>
  );
};
