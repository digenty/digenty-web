type AlertItem = {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ color?: string }>;
  label: string;
  iconColor?: string;
};

type AlertListProps = {
  item: AlertItem;
};

export default function AlertList({ item }: AlertListProps) {
  const Icon = item.icon;
  return (
    <li className="border-border-default flex items-start gap-3 rounded-md border px-3 py-6">
      <div className="rounded-full bg-gray-100 p-1">
        <Icon color={item.iconColor} />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-m text-text-default font-semibold">{item.title}</p>
        <p className="text-text-muted text-sm">{item.description}</p>
        <span className="bg-bg-state-soft text-text-subtle w-fit rounded-sm px-2 py-1 text-xs">{item.label}</span>
      </div>
    </li>
  );
}
