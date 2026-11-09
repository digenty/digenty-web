import { CheckboxCircleFill, Loader2Fill } from "@digenty/icons";
import { useEffect, useRef } from "react";

import { useIsMobile } from "@/hooks/useIsMobile";
import { useScrollEdges } from "@/hooks/useScrollEdges";
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

  const { ref: scrollRef, atStart, atEnd } = useScrollEdges<HTMLDivElement>();
  const activeChipRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeChipRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [currentStep]);

  if (isMobile && compactOnMobile) {
    return (
      <div className={cn("bg-bg-card border-border-default flex w-full flex-col gap-3 rounded-md border p-3", className)}>
        <span className="text-text-muted text-sm">
          Step {currentIndex + 1} of {steps.length}: <span className="text-text-default font-medium">{steps[currentIndex]?.label}</span>
        </span>

        <div className="relative">
          <div ref={scrollRef} className="hide-scrollbar flex items-center gap-2 overflow-x-auto scroll-smooth" style={{ scrollbarWidth: "none" }}>
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;

              return (
                <button
                  key={step.id}
                  ref={isActive ? activeChipRef : undefined}
                  type="button"
                  onClick={() => onSelectStep?.(step.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all",
                    isActive ? "bg-bg-state-secondary border-border-darker text-text-default" : "border-border-default text-text-muted",
                  )}
                >
                  {completedSteps.includes(step.id) ? (
                    <CheckboxCircleFill fill="var(--color-icon-success)" className="size-3.5 shrink-0" />
                  ) : (
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
                        isActive ? "border-border-informative text-text-informative" : "bg-bg-subtle border-border-darker",
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                  {step.label}
                </button>
              );
            })}
          </div>
          {!atStart && <div className="from-bg-card pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r to-transparent" />}
          {!atEnd && <div className="from-bg-card pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l to-transparent" />}
        </div>

        <div className="bg-bg-subtle h-1 w-full overflow-hidden rounded-full">
          <div
            className="bg-bg-state-primary h-full rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          />
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
