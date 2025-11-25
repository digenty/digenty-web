"use client";

import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Toggle = ({ label, className, ...props }: ToggleProps) => {
  return (
    <div className={cn("border-border-default bg-bg-subtle flex h-6 items-center gap-1 rounded-full border px-2", className)}>
      {label && <span className="text-text-default text-xs font-medium">{label}</span>}

      <label className="bg-bg-switch-default relative inline-flex h-[14px] w-[30px] cursor-pointer items-center rounded-full px-[2px]">
        <input type="checkbox" className="peer sr-only" {...props} />

        <span className="bg-bg-switch-handle block h-[12px] w-[12px] rounded-full transition-all peer-checked:translate-x-[14px]" />
      </label>
    </div>
  );
};
