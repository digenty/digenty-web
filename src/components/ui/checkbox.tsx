"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type CheckboxProps = Omit<React.ComponentProps<typeof CheckboxPrimitive.Root>, "onCheckedChange"> & {
  onCheckedChange?: (checked: boolean) => void;
};

// Radix types its change callback as CheckedState (boolean | "indeterminate", widened to string in newer releases).
// A user click only ever toggles between true and false, so callers get a plain boolean.
function Checkbox({ className, onCheckedChange, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-border-darker data-[state=checked]:border-bg-checkbox-active data-[state=checked]:bg-bg-checkbox-active data-[state=checked]:text-icon-white-default focus-visible:ring-border-highlight aria-invalid:ring-destructive/20 aria-invalid:border-destructive disabled:bg-bg-checkbox-disabled disabled:text-icon-default-disabled size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:border focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed",
        className,
      )}
      onCheckedChange={checked => onCheckedChange?.(checked === true)}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="flex items-center justify-center text-current transition-none">
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
