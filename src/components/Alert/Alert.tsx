import { Bill } from "@digenty/icons";

import { Button } from "../ui/button";
import { AlertSeverity, DashboardAlert } from "./type";

const SEVERITY_STYLES: Record<AlertSeverity, { badge: string; icon: string }> = {
  SUCCESS: { badge: "bg-bg-basic-green-subtle", icon: "var(--color-bg-basic-green-strong)" },
  WARNING: { badge: "bg-bg-basic-yellow-subtle", icon: "var(--color-bg-basic-yellow-strong)" },
  INFO: { badge: "bg-bg-basic-sky-subtle", icon: "var(--color-bg-basic-sky-strong)" },
};

const ACTION_LABEL: Record<DashboardAlert["type"], string | null> = {
  PAYMENT_OUTSTANDING: "Send Reminder",
  PAYMENT_COMPLETED: null,
};

type AlertListProps = {
  alert: DashboardAlert;
};

export const Alert = ({ alert }: AlertListProps) => {
  const styles = SEVERITY_STYLES[alert.severity];
  const action = ACTION_LABEL[alert.type];

  return (
    <li className="border-border-default flex items-start gap-3 rounded-md border px-3 py-4">
      <div className={`flex size-7 items-center justify-center rounded-full p-1 ${styles.badge}`}>
        <Bill fill={styles.icon} className="size-4" />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <p className="text-text-default text-sm font-medium">{alert.title}</p>
        <p className="text-text-subtle text-sm font-normal">{alert.message}</p>
        {action && (
          <Button className="bg-bg-state-soft hover:bg-bg-state-soft-hover text-text-subtle h-6 w-fit rounded-md px-1.5 text-xs">{action}</Button>
        )}
      </div>
    </li>
  );
};
