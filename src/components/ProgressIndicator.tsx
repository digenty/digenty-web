import { CheckboxCircleFill, Loader2Fill } from "@digenty/icons";
import { ChevronDown } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/useIsMobile";
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
  onSelectStep,
  compactOnMobile = false,
}: {
  className?: string;
  currentStep: string;
  steps: Step[];
  completedSteps: string[];
  onSelectStep?: (stepId: string) => void;
  compactOnMobile?: boolean;
}) => {
  const isMobile = useIsMobile();
  const currentIndex = Math.max(
    0,
    steps.findIndex(step => step.id === currentStep),
  );
  const nextStep = steps[currentIndex + 1];

  if (isMobile && compactOnMobile) {
    return (
      <div className={cn("bg-bg-card border-border-default flex w-full flex-col gap-3 rounded-md border p-3", className)}>
        <div className="flex items-center justify-between">
          <span className="text-text-muted text-sm">
            Step {currentIndex + 1} of {steps.length}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="text-text-default flex items-center gap-1 text-sm font-medium">
                All steps <ChevronDown className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-bg-card border-border-default text-text-default w-56">
              {steps.map((step, index) => (
                <DropdownMenuItem
                  key={step.id}
                  onClick={() => onSelectStep?.(step.id)}
                  className={cn("text-sm", step.id === currentStep && "text-text-informative font-medium")}
                >
                  {index + 1}. {step.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="bg-bg-subtle h-1 w-full overflow-hidden rounded-full">
          <div
            className="bg-bg-state-primary h-full rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-text-default text-sm font-semibold">{steps[currentIndex]?.label}</span>
          {nextStep && <span className="text-text-muted line-clamp-1 text-sm">Next: {nextStep.label}</span>}
        </div>
      </div>
    );
  }

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
