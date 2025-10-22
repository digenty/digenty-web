type OverviewCardProps = {
  title: string;
  icon: React.ReactNode;
  value: string;
  color: string;
  percentage: string;
  iconBg?: string;
};

export const OverviewCard = ({ title, icon, value, color, percentage, iconBg }: OverviewCardProps) => {
  const bg = color ? color.replace(/-500(?=\))/, "-100") : "transparent";
  const isZeroValue = value === "₦0" || value === "0";

  // 🔹 Automatically generate the border color from iconBg
  // e.g. var(--green-200) → var(--green-500)
  const borderFromBg = iconBg?.includes("-200")
    ? iconBg.replace("-200", "-500")
    : iconBg?.includes("-300")
      ? iconBg.replace("-300", "-500")
      : iconBg?.includes("-100")
        ? iconBg.replace("-100", "-500")
        : iconBg;

  return (
    <div className="border-border-default box flex w-full flex-col gap-5 rounded-md border p-6">
      <div className="flex items-center gap-3">
        <div
          className="w-6 rounded-xs border-2 p-1"
          style={{
            backgroundColor: iconBg || "transparent",
            borderColor: borderFromBg || "var(--border-default)",
          }}
        >
          {icon}
        </div>
        <div className="text-text-muted text-sm capitalize">{title}</div>
      </div>

      <div className="flex items-center gap-3">
        <h3 className={`text-2xl font-semibold ${isZeroValue ? "text-text-muted" : "text-text-default"}`}>{value}</h3>

        {percentage && (
          <small
            className="border-border-default rounded-sm border px-1.5 py-0.5 text-xs"
            style={{
              color,
              backgroundColor: bg,
            }}
          >
            {percentage}
          </small>
        )}
      </div>
    </div>
  );
};
