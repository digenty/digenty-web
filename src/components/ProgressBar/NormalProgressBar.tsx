import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps {
  value: number | string;
  max?: number;
  height?: number;
  trackColor?: string;
  indicatorColor?: string;
  radius?: number | string;
  animated?: boolean;
  showPercentage?: boolean;
  renderLabel?: (percentage: number) => React.ReactNode;
  className?: string;
}

export function NormalProgressBar({
  value,
  max = 100,
  height = 8,
  trackColor = "bg-muted",
  indicatorColor = "bg-primary",
  radius = 9999,
  animated = true,
  showPercentage = false,
  renderLabel,
  className,
}: ProgressProps) {
  const percentage = React.useMemo(() => {
    if (typeof value === "string") {
      const numeric = parseFloat(value);
      return Math.min(Math.max(numeric, 0), 100);
    }

    return Math.min(Math.max((value / max) * 100, 0), 100);
  }, [value, max]);

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn("relative w-full overflow-hidden", trackColor)}
        style={{
          height,
          borderRadius: radius,
        }}
      >
        <div
          className={cn("h-full transition-all", indicatorColor, animated && "duration-500 ease-out")}
          style={{
            width: `${percentage}%`,
            borderRadius: radius,
          }}
        />
      </div>

      {(showPercentage || renderLabel) && (
        <div className="text-text-muted text-xs">{renderLabel ? renderLabel(percentage) : `${Math.round(percentage)}%`}</div>
      )}
    </div>
  );
}
