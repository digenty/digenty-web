import { ReactNode } from "react";
import { StatCard } from "../StatCard";

type OverviewCardProps = {
  title: ReactNode;
  Icon: () => React.ReactNode;
  value?: string | number | ReactNode;
  className?: string;
};

/**
 * Legacy API (icon passed as a render function that draws its own tile). New code should use `StatCard` directly.
 * Call sites size their own tile differently (w-6, h-5 w-5, rounded-xs), so the tile and its glyph are forced
 * to the same 32px / rounded-lg / 14px that `StatCard` uses, keeping every card consistent.
 */
export const OverviewCard = ({ title, Icon, value, className }: OverviewCardProps) => {
  const isZeroValue = value === "₦0" || value === "0";

  return (
    <StatCard
      title={title}
      icon={
        <span className="flex shrink-0 [&_svg]:size-3.5! [&>div]:size-8! [&>div]:rounded-lg! [&>div]:p-0!">
          <Icon />
        </span>
      }
      value={value}
      isEmpty={isZeroValue}
      className={className}
    />
  );
};
