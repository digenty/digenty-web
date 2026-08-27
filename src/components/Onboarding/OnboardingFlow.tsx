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
  const needsOnboarding = !user?.schoolId;
  // Nothing to have progress on before a school exists — this endpoint is school-scoped.
  const { data: progressResp, isLoading: isProgressLoading, refetch: refetchProgress } = useGetOnboardingProgress(!needsOnboarding);

  // Once the welcome flow opens, keep it mounted until it explicitly finishes.
  // schoolId flips truthy partway through (right after the branch step), but the
  // user still has the welcome/plan step left to see - if we derived this straight
  // from `needsOnboarding` it would unmount mid-flow and let the setup-guide modal
  // below race in ahead of it.
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(needsOnboarding);

  useEffect(() => {
    if (needsOnboarding) setIsOnboardingModalOpen(true);
  }, [needsOnboarding]);

  const apiSteps = progressResp?.data?.steps || [];

  const areRequiredStepsCompleted = [1, 2, 3, 4].every(id => {
    const apiStep = apiSteps.find((step: OnboardingStepsType) => step.stepNumber === id);
    return apiStep?.completed ?? false;
  });

  const { showSetupSteps, setShowSetupSteps } = useOnboardingStore();

  useEffect(() => {
    if (showSetupSteps) {
      refetchProgress();
    }
  }, [showSetupSteps]);

  useEffect(() => {
    // Only auto-open if we have a schoolId and progress has finished loading
    if (user?.schoolId && !isProgressLoading) {
      // const isSetupPage = pathname.includes("/settings") || pathname.includes("/student-and-parent-record");
      const isSetupPage = pathname.includes("/settings");

      // Auto-open if required steps are not completed AND it's not a setup page AND it's currently closed
      // AND the welcome flow modal isn't still showing its final step.
      if (!areRequiredStepsCompleted && !isSetupPage && !showSetupSteps && !isOnboardingModalOpen) {
        setShowSetupSteps(true);
      }
    }
  }, [user?.schoolId, isProgressLoading, areRequiredStepsCompleted, pathname, setShowSetupSteps, isOnboardingModalOpen]);

  return (
    <>
      {isOnboardingModalOpen && <OnboardingModal initialShow={isOnboardingModalOpen} onClose={() => setIsOnboardingModalOpen(false)} />}
      {!isOnboardingModalOpen && showSetupSteps && user?.isMain && (
        <OnboardingStepsModal open={showSetupSteps} setOpen={setShowSetupSteps} apiSteps={apiSteps} />
      )}
    </>
  );
};
