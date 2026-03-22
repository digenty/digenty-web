"use client";

import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  withBorder?: boolean;
}

export const Toggle = ({ label, className, checked, withBorder = true, ...props }: ToggleProps) => {
  return (
    <div
      className={cn(
        "flex h-6 items-center gap-1 rounded-full px-2",
        withBorder && "border-border-default bg-bg-subtle border",
        checked && "bg-bg-badge-green border-bg-switch-active",
        className,
      )}
    >
      {label && <span className={cn("text-text-default text-xs font-medium", checked && "text-bg-switch-active")}>{label}</span>}

      <label
        className={cn(
          "bg-bg-switch-default relative inline-flex cursor-pointer items-center rounded-full px-0.5",
          checked && "bg-bg-switch-active",
          withBorder ? "h-3 w-7" : "h-5 w-8",
        )}
      >
        <input type="checkbox" className="peer sr-only" {...props} />

        <span
          className={cn("bg-bg-switch-handle block rounded-full transition-all peer-checked:translate-x-3", withBorder ? "h-3 w-3" : "h-3.5 w-3.5")}
        />
      </label>
    </div>
  );
};
