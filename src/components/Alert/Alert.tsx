type ActiveAlert = {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ color?: string }>;
  label: string;
  iconColor?: string;
};

type AlertListProps = {
  activeAlert: ActiveAlert;
};

export const Alert = ({ activeAlert }: AlertListProps) => {
  const Icon = activeAlert.icon;
  return (
    <li className="border-border-default flex items-start gap-3 rounded-md border px-3 py-6">
      <div className="bg-bg-state-soft flex size-7 items-center justify-center rounded-full p-1">
        <Icon color={activeAlert.iconColor} />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <p className="text-text-default text-sm font-medium">{activeAlert.title}</p>
        <p className="text-text-subtle text-sm font-normal">{activeAlert.description}</p>
        <span className="bg-bg-state-soft text-text-subtle w-fit rounded-md px-1.5 py-1 text-xs">{activeAlert.label}</span>
      </div>
    </li>
  );
};
