import { Alerts } from "../Alert";
import AlertFill from "../Icons/AlertFill";
import CashFill from "../Icons/CashFill";
import IndeterminateCircleFill from "../Icons/IndeterminateCircleFill";
import UserFill from "../Icons/UserFill";
import { OverviewCard } from "../OverviewCard";
import { Chart } from "./Chart";
import DashboardHeader from "./DashboardHeader";
import { QuickActions } from "./QuickActions";

export const Dashboard = () => {
  return (
    <div className="space-y-6 px-4 py-6 md:space-y-8 md:px-8">
      <DashboardHeader />

      <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        <OverviewCard
          title="Fees collected"
          Icon={() => (
            <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <CashFill fill="var(--color-icon-default)" className="size-[10px]" />
            </div>
          )}
          value="₦200,280"
        />
        <OverviewCard
          title="outstanding fees"
          Icon={() => (
            <div className="bg-bg-basic-yellow-subtle border-bg-basic-yellow-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <AlertFill fill="var(--color-icon-default)" className="size-[10px]" />
            </div>
          )}
          value="₦50,000"
        />
        <OverviewCard
          title="students"
          Icon={() => (
            <div className="bg-bg-basic-sky-subtle border-bg-basic-sky-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <UserFill fill="var(--color-icon-default)" className="size-[10px]" />
            </div>
          )}
          value="₦50,000"
        />

        <OverviewCard
          title="Expenses"
          Icon={() => (
            <div className="bg-bg-basic-pink-subtle border-bg-basic-pink-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <IndeterminateCircleFill fill="var(--color-icon-default)" className="size-[10px]" />
            </div>
          )}
          value="₦0"
        />
      </div>

      <QuickActions />

      <div className="base:flex-row flex flex-col gap-3">
        <div className="border-border-default bg-bg-default base:w-[65%] w-full rounded-md border">
          <Chart />
        </div>
        <div className="border-border-default bg-bg-default base:h-111 base:w-[35%] w-full overflow-hidden rounded-md border">
          <Alerts />
        </div>
      </div>
    </div>
  );
};
