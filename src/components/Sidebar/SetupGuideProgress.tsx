"use client";

import { useOnboardingStore } from "@/store";

export const SetupGuideProgress = () => {
  const { steps } = useOnboardingStore();
  const completedStepsCount = steps.filter(s => s.isCompleted).length;
  // Prevent division by zero if steps array is empty
  const progressPercentage = steps.length > 0 ? (completedStepsCount / steps.length) * 100 : 0;

  // Don't show if all steps are magically completed (optional, but usually a guide goes away when 100% done, but let's keep it if 100% until dismissed by other logic. Actually, standard is to show it always until onboarding is officially closed. We will just render it).

  return (
    <div className="bg-bg-basic-gray-alpha-4 border-border-default my-4 flex flex-col gap-2.5 rounded-xl border p-3">
      <div className="flex items-center justify-between">
        <span className="text-text-default text-sm font-medium">Setup Guide</span>
        <span className="text-text-muted text-sm font-normal">{Math.round(progressPercentage)}%</span>
      </div>

      <div className="bg-border-default relative h-1 w-full overflow-hidden rounded-full">
        <div className="bg-bg-basic-green-accent h-full transition-all duration-500 ease-in-out" style={{ width: `${progressPercentage}%` }} />
      </div>
    </div>
  );
};
