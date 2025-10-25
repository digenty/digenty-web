type OverviewCardProps = {
  title: string;
  Icon: () => React.ReactNode;
  value: string;
};

export const OverviewCard = ({ title, Icon, value }: OverviewCardProps) => {
  const isZeroValue = value === "₦0" || value === "0";

  return (
    <div className="border-border-default box flex w-full flex-col gap-4 rounded-md border px-3 py-4 md:gap-5 md:p-6">
      <div className="flex items-center gap-3">
        <Icon />
        <div className="text-text-muted text-xs font-medium capitalize">{title}</div>
      </div>

      <div className="flex items-center gap-3">
        <h3 className={`text-lg font-medium md:text-2xl md:font-semibold ${isZeroValue ? "text-text-muted" : "text-text-default"}`}>{value}</h3>

        {/* {percentage && (
          <small
            className="border-border-default rounded-sm border px-1.5 py-0.5 text-xs"
            style={{
              color,
              backgroundColor: bg,
            }}
          >
            {percentage}
          </small>
        )} */}
      </div>
    </div>
  );
};
