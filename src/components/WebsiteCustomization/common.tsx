"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

/** Shared soft input styling used across every editor field. */
export const INPUT_CLASS = "bg-bg-input-soft! text-text-default placeholder:text-text-muted rounded-md border-none text-sm shadow-none";

/** Field wrapper: label row (with optional right-aligned hint) over the control. */
export const Field = ({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-2", className)}>
    <div className="flex items-center justify-between">
      <Label className="text-text-default text-sm font-medium">{label}</Label>
      {typeof hint === "string" ? <span className="text-text-muted text-sm">{hint}</span> : hint}
    </div>
    {children}
  </div>
);

/** Small square icon button (e.g. the trash button beside a row). */
export const SquareIconButton = ({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    className={cn(
      "bg-bg-input-soft hover:bg-bg-state-soft-hover flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

/** Ghost text button used for "+ Add …" actions. */
export const AddButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-text-default hover:bg-bg-state-soft-hover flex w-fit cursor-pointer items-center gap-1.5 rounded-md py-1 text-sm font-medium transition-colors"
  >
    <span className="text-text-muted text-base leading-none">+</span>
    {label}
  </button>
);
