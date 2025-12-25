"use client";

import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Toggle = ({ label, className, checked, ...props }: ToggleProps) => {
  return (
    <div
      className={cn(
        "border-border-default bg-bg-subtle flex h-6 items-center gap-1 rounded-full border px-2",
        checked && "bg-bg-badge-green border-bg-switch-active",
        className,
      )}
    >
      {label && <span className={cn("text-text-default text-xs font-medium", checked && "text-bg-switch-active")}>{label}</span>}

      <label
        className={cn(
          "bg-bg-switch-default relative inline-flex h-3 w-7 cursor-pointer items-center rounded-full px-0.5",
          checked && "bg-bg-switch-active",
        )}
      >
        <input type="checkbox" className="peer sr-only" {...props} />

        <span className="bg-bg-switch-handle block h-3 w-3 rounded-full transition-all peer-checked:translate-x-3" />
      </label>
    </div>
  );
};
