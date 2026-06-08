import { useGetOnboardingProgress } from "@/hooks/queryHooks/useSchool";
import { useOnboardingStore } from "@/store";
import { Tooltip } from "../Tooltip";

const RADIUS = 15;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const SetupGuideProgress = ({ isCollapsed = false }: { isCollapsed?: boolean }) => {
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

  if (progressPercentage === 100) return null;

  if (isCollapsed) {
    return (
      <Tooltip
        description="Setup progress"
        Trigger={
          <div onClick={() => setShowSetupSteps(true)} role="button" tabIndex={0} className="my-4 flex cursor-pointer items-center justify-center">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <svg className="absolute -inset-[1px] -rotate-90" viewBox="0 0 40 40" width="36" height="36">
                <circle cx="18" cy="18" r={RADIUS} fill="none" stroke="var(--color-border-default)" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r={RADIUS}
                  fill="none"
                  stroke="var(--color-bg-basic-green-accent)"
                  strokeWidth="3"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={CIRCUMFERENCE * (1 - progressPercentage / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-text-default absolute flex items-center justify-center text-[9px] font-semibold">
                {Math.round(progressPercentage)}%
              </div>
            </div>
          </div>
        }
      />
    );
  }

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
