import { cn } from "@/lib/utils";
import { Step } from "./types";
import Loader2Fill from "@/components/Icons/Loader2Fill";
import CheckboxCircleFill from "@/components/Icons/CheckboxCircleFill";

export const CSVUploadProgress = ({ className, currentStep, steps }: { className?: string; currentStep: number; steps: Step[] }) => {
  return (
    <div
      className={cn(
        "bg-bg-card border-border-default grid w-auto items-center rounded-md border p-3 md:px-5 md:py-4",
        `grid-cols-${steps.length}`,
        className,
      )}
    >
      {steps.map(step => (
        <div key={step.id} className="space-y-4">
          <div className="after:border-border-darker flex items-center after:mx-1 after:w-full after:border-t">
            {currentStep === step.id ? (
              <Loader2Fill fill="var(--color-icon-informative)" className="size-6" />
            ) : step.completed ? (
              <CheckboxCircleFill fill="var(--color-icon-success)" />
            ) : (
              <div className="bg-bg-subtle border-border-darker text-text-default flex aspect-square size-6 items-center justify-center rounded-full border text-xs font-semibold">
                {step.id}
              </div>
            )}
          </div>
          <div className="text-text-default mr-5 text-sm font-medium md:text-base">{step.label}</div>
        </div>
      ))}
    </div>
  );
};
