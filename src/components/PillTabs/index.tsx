import { cn } from "@/lib/utils";

export type PillTab = { id: string; label: string };

type PillTabsProps = {
  tabs: PillTab[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
};

/** Controlled segmented tabs, for tabs driven by the URL or parent state. For self-contained tabs with content, use `Tabs`. */
export const PillTabs = ({ tabs, activeId, onChange, className }: PillTabsProps) => (
  <div role="tablist" className={cn("bg-bg-state-soft flex w-full max-w-72 items-center gap-1 rounded-xl p-1", className)}>
    {tabs.map(tab => {
      const isActive = activeId === tab.id;
      return (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex-1 cursor-pointer rounded-lg py-1.5 text-center text-sm font-medium transition-all duration-150",
            isActive ? "bg-bg-default text-text-default shadow-light" : "text-text-muted hover:text-text-default",
          )}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);
