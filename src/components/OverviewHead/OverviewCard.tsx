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
  return (
    <div className="border-default-transparent/5 box flex flex-col gap-5 rounded-md border p-6 text-zinc-950">
      <div className="flex items-center gap-3">
        <div className="w-6 rounded-xs border p-1" style={iconBg ? { backgroundColor: iconBg } : {}}>
          {icon}
        </div>
        <div className="text-sm text-gray-600 capitalize">{title}</div>
      </div>
      <div className="flex items-center gap-3">
        <h3 className="text-2xl font-semibold sm:text-base">{value}</h3>
        <small
          className="rounded-sm border px-1.5 py-0.5 text-xs"
          style={{ color: color, border: color, borderWidth: "1px", borderStyle: "solid", backgroundColor: `${color}-light` }}
        >
          {percentage}
        </small>
      </div>
    </div>
  );
};
