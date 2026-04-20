"use client";

import { useGetOnboardingProgress } from "@/hooks/queryHooks/useSchool";
import { JWTPayload } from "@/types";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import OnboardingModal from "./OnBoardingModal";
import { OnboardingStepsModal } from "./OnboardingStepsModal";
import { OnboardingStepsType } from "@/api/types";

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

  // We show the setup steps modal if they have a schoolId
  const [showSetupSteps, setShowSetupSteps] = useState(!!user?.schoolId);

  useEffect(() => {
    if (user?.schoolId) {
      setShowSetupSteps(true);
    }
  }, [user?.schoolId]);

  useEffect(() => {
    // If user navigates away from setup pages, re-open the modal if required steps are not completed
    const isSetupPage = pathname.includes("/settings") || pathname.includes("/student-and-parent-record");
    if (!areRequiredStepsCompleted && !isSetupPage) {
      setShowSetupSteps(true);
    }
  }, [pathname, areRequiredStepsCompleted]);

  return (
    <>
      {showOnboardingModal && <OnboardingModal initialShow={showOnboardingModal} />}
      {!showOnboardingModal && showSetupSteps && user?.isMain && !isProgressLoading && !areRequiredStepsCompleted && (
        <OnboardingStepsModal open={showSetupSteps} setOpen={setShowSetupSteps} apiSteps={apiSteps} />
      )}
    </>
  );
};
