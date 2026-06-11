"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  /** When provided, renders the "Visible" toggle in the header. */
  visible?: boolean;
  onVisibleChange?: (value: boolean) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const SectionCard = ({ icon, title, visible, onVisibleChange, defaultOpen = false, children }: SectionCardProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const hasToggle = typeof visible === "boolean";

  return (
    <div className="bg-bg-card border-border-default rounded-md border shadow-xs">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(prev => !prev)}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(prev => !prev);
          }
        }}
        className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3.5"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex size-5 items-center justify-center [&_svg]:size-5">{icon}</span>
          <span className="text-text-default text-sm font-semibold">{title}</span>
        </div>

        <div className="flex items-center gap-3">
          {hasToggle && (
            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
              <span className="text-text-muted text-sm">Visible</span>
              <Switch checked={visible} onCheckedChange={onVisibleChange} />
            </div>
          )}
          <ChevronDownIcon className={cn("text-icon-default-muted size-4 transition-transform", open && "rotate-180")} />
        </div>
      </div>

      {open && <div className="border-border-default flex flex-col gap-5 border-t px-4 py-5">{children}</div>}
    </div>
  );
};
