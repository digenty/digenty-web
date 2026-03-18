import CheckboxCircleFill from "@/components/Icons/CheckboxCircleFill";
import Loader2Fill from "@/components/Icons/Loader2Fill";
import { cn } from "@/lib/utils";

export type Step = {
  id: string;
  label: string;
  completed: boolean;
};

export const ProgressIndicator = ({
  className,
  currentStep,
  steps,
  completedSteps,
}: {
  className?: string;
  currentStep: string;
  steps: Step[];
  completedSteps: string[];
}) => {
  return (
    <div
      className={cn(
        "bg-bg-card border-border-default grid w-full items-center rounded-md border p-3 md:px-5 md:py-4",
        `grid-cols-${steps.length}`,
        className,
      )}
    >
      {steps.map((step, index) => (
        <div key={step.id} className="w-full space-y-4">
          <div className="after:border-border-darker flex items-center after:mx-1 after:w-full after:border-t">
            {step.id === currentStep ? (
              <Loader2Fill fill="var(--color-icon-informative)" className="size-6" />
            ) : completedSteps.includes(step.id) ? (
              <CheckboxCircleFill fill="var(--color-icon-success)" />
            ) : (
              <div className="bg-bg-subtle border-border-darker text-text-default flex aspect-square size-6 items-center justify-center rounded-full border text-xs font-semibold">
                {index + 1}
              </div>
            )}
          </div>
          <div className="text-text-default text-sm font-medium md:text-base">{step.label}</div>
        </div>
      ))}
    </div>
  );
};
