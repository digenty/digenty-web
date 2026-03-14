"use client";

import { JWTPayload } from "@/types";
import { useState } from "react";
import OnboardingModal from "./OnBoardingModal";
import { OnboardingStepsModal } from "./OnboardingStepsModal";

interface OnboardingFlowProps {
  user: Partial<JWTPayload> | null;
}

export const OnboardingFlow = ({ user }: OnboardingFlowProps) => {
  // If no schoolId, we show the initial onboarding modal
  const showInitial = !user?.schoolId;

  // We show the steps modal if they have a schoolId
  // In a real app, this would also check an "onboardingCompleted" state from an API
  // or examine if sessions/branches have been configured.
  // For now, we'll follow the requirement to show it "immediately after" the initial modal.
  const [showSteps, setShowSteps] = useState(!!user?.schoolId);

  return (
    <>
      {showInitial && <OnboardingModal initialShow={showInitial} />}
      {!showInitial && showSteps && <OnboardingStepsModal open={showSteps} setOpen={setShowSteps} />}
    </>
  );
};
