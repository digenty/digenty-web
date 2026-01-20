"use client";
import React, { useState } from "react";
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
  color = "bg-bg-checkbox-active",
  disabled = false,
  className,
}) => {
  const sizeClasses = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-7 h-7" : "w-5 h-5";
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      role="checkbox"
      type="button"
      aria-checked={checked}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "border-border-darker flex items-center justify-center rounded-full border transition-all duration-150",
        sizeClasses,
        checked ? `${color} border-transparent` : "bg-bg-checkbox-default hover:bg-icon-white-default",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {isHovered && !checked && <span className="bg-bg-basic-gray-subtle block size-1.5 rounded-full" />}
      {checked && <span className="bg-icon-white-default hover:bg-icon-white-default block size-1.5 rounded-full" />}
    </button>
  );
};
