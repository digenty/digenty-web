import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Skeleton } from "../ui/skeleton";

type StatCardProps = {
  title: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
  /** Tailwind classes for the icon tile, e.g. background + border colour tokens. Omit when `icon` renders its own tile. */
  iconClassName?: string;
  loading?: boolean;
  /** Mutes the value, e.g. when it is zero. */
  isEmpty?: boolean;
  className?: string;
};

export const StatCard = ({ title, value, icon, iconClassName, loading, isEmpty, className }: StatCardProps) => (
  <div
    className={cn(
      "border-border-default bg-bg-default shadow-light flex w-full flex-col gap-5 rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md md:p-5",
      className,
    )}
  >
    <div className="flex items-center justify-between gap-2">
      <span className="text-text-muted truncate text-xs font-medium tracking-wide uppercase">{title}</span>
      {icon &&
        (iconClassName ? (
          <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg border", iconClassName)}>{icon}</div>
        ) : (
          icon
        ))}
    </div>

    {loading ? (
      <Skeleton className="bg-bg-input-soft h-8 w-28 rounded-md" />
    ) : (
      <h3 className={cn("truncate text-xl font-semibold tracking-tight md:text-3xl", isEmpty ? "text-text-muted" : "text-text-default")}>{value}</h3>
    )}
  </div>
);
