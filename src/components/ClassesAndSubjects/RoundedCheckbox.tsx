"use client";
import React from "react";
import { cn } from "@/lib/utils";

export interface RoundedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: "sm" | "md" | "lg";
  color?: string;
  disabled?: boolean;
  className?: string;
}

export const RoundedCheckbox: React.FC<RoundedCheckboxProps> = ({
  checked,
  onChange,
  size = "sm",
  color = "bg-blue-500",
  disabled = false,
  className,
}) => {
  const sizeClasses = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-7 h-7" : "w-5 h-5";

  return (
    <button
      type="button"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "flex items-center justify-center rounded-full border border-gray-300 transition-all duration-150",
        sizeClasses,
        checked ? `${color} border-transparent` : "bg-white hover:bg-gray-100",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {checked && <span className="block size-2 rounded-full bg-white" />}
    </button>
  );
};
