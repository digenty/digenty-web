"use client";

import { useGetDashboardAlerts } from "@/hooks/queryHooks/useDashboard";
import { ErrorComponent } from "../Error/ErrorComponent";
import { Skeleton } from "../ui/skeleton";
import { Alert } from "./Alert";

type AlertsProps = {
  termId: number | null;
  branchId: number | null;
};

export const Alerts = ({ termId, branchId }: AlertsProps) => {
  const { data: alerts, isLoading, isError } = useGetDashboardAlerts(termId, branchId);

  return (
    <div className="base:pb-12 relative h-full space-y-6 overflow-hidden px-5 py-5 md:space-y-5">
      <h3 className="text-text-default text-xs font-semibold">Alerts</h3>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="bg-bg-input-soft h-20 w-full rounded-md" />
          <Skeleton className="bg-bg-input-soft h-20 w-full rounded-md" />
        </div>
      ) : isError || !alerts?.length ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 overflow-y-auto">
          <ErrorComponent title="No Alerts" description="You have no alerts" />
        </div>
      ) : (
        <ul className="flex h-full flex-col gap-3 overflow-y-auto">
          {alerts.map((alert, index) => (
            <Alert key={`${alert.classId}-${alert.type}-${index}`} alert={alert} />
          ))}
        </ul>
      )}
    </div>
  );
};
