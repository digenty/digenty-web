// import style from "./OverviewCard.module.css";
type OverviewCardProps = {
  title: string;
  icon: React.ReactNode;
  value: string;
  color: string;
  percentage: string;
  iconBg?: string;
};

export const OverviewCard = ({ title, icon, value, color, percentage, iconBg }: OverviewCardProps) => {
  const bg = color.replace(/-500(?=\))/, "-100");

  return (
    <div className="border-border-default box flex w-full flex-col gap-5 rounded-md border p-6">
      <div className="flex items-center gap-3">
        <div className="border-border-default w-6 rounded-xs border p-1" style={iconBg ? { backgroundColor: iconBg } : {}}>
          {icon}
        </div>
        <div className="text-text-muted text-sm capitalize">{title}</div>
      </div>
      <div className="flex items-center gap-3">
        <h3 className="text-text-default text-2xl font-semibold">{value}</h3>
        <small className="border-border-default rounded-sm border px-1.5 py-0.5 text-xs" style={{ color: color, backgroundColor: bg }}>
          {percentage}
        </small>
      </div>
    </div>
  );
};
