import { useGetOnboardingProgress } from "@/hooks/queryHooks/useSchool";
import { useOnboardingStore } from "@/store";

export const SetupGuideProgress = () => {
  const { steps, setShowSetupSteps } = useOnboardingStore();
  const { data: progressResp, isLoading } = useGetOnboardingProgress();

  if (isLoading || !progressResp) return null;

  const apiSteps = progressResp.data.steps || [];

  const mergedSteps = steps.map(storeStep => {
    const apiStep = apiSteps.find((step: { stepNumber: number; completed: boolean }) => step.stepNumber === storeStep.id);
    return {
      ...storeStep,
      isCompleted: apiStep ? apiStep.completed : storeStep.isCompleted,
    };
  });

  const completedStepsCount = mergedSteps.filter(s => s.isCompleted).length;
  const progressPercentage = mergedSteps.length > 0 ? (completedStepsCount / mergedSteps.length) * 100 : 0;

  // If the progress is 100%, don't show the setup guide on the sidebar
  if (progressPercentage === 100) return null;

  return (
    <div
      onClick={() => setShowSetupSteps(true)}
      role="button"
      tabIndex={0}
      className="bg-bg-basic-gray-alpha-4 border-border-default hover:bg-bg-basic-gray-alpha-8 my-4 flex cursor-pointer flex-col gap-2.5 rounded-xl border p-3 transition-colors"
    >
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
