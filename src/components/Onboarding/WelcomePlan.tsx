"use client";

import { RocketFill } from "@digenty/icons";
import { Button } from "../ui/button";

interface WelcomePlanProps {
  onUpgrade: () => void;
  onFinish: () => void;
}

export const WelcomePlan = ({ onUpgrade, onFinish }: WelcomePlanProps) => {
  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <div className="animate-in fade-in-0 zoom-in-95 flex flex-col items-center gap-3 duration-700" style={{ animationFillMode: "both" }}>
        <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex size-12 items-center justify-center rounded-full border">
          <RocketFill fill="var(--color-icon-default)" className="size-6" />
        </div>

        <div className="text-text-default text-xl font-semibold">Welcome to Axis! 🎉</div>
        <div className="text-text-muted mx-auto max-w-sm text-sm">
          Your school is all set up and ready to go. We can&apos;t wait to see what you build here.
        </div>
      </div>

      <div
        className="animate-in fade-in-0 slide-in-from-bottom-2 border-border-default bg-bg-card-subtle mx-auto flex w-full max-w-sm flex-col items-center gap-2 rounded-lg border p-4 delay-300 duration-700"
        style={{ animationFillMode: "both" }}
      >
        <div className="text-text-default text-sm font-medium">
          You&apos;re currently on the <span className="font-semibold">Free plan</span>
        </div>
        <div className="text-text-muted text-xs">Upgrade to unlock more students, branches, and features for your school.</div>

        <Button onClick={onUpgrade} className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary-hover! mt-2 border-none">
          Upgrade
        </Button>
      </div>

      <button
        type="button"
        onClick={onFinish}
        className="text-text-muted hover:text-text-default animate-in fade-in-0 text-xs font-medium underline-offset-4 delay-500 duration-700 hover:underline"
        style={{ animationFillMode: "both" }}
      >
        Maybe later, take me to my dashboard
      </button>
    </div>
  );
};
