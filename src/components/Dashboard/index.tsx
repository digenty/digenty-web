import Image from "next/image";
import { Alerts } from "../Alert";
import { Chart } from "./Chart";
import { OverviewCard } from "../OverviewCard";
import OverviewHeader from "./OverviewHeader";

export const Dashboard = () => {
  return (
    <div className="space-y-6 px-4 py-6 md:space-y-8 md:px-8">
      <OverviewHeader />

      <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        <OverviewCard
          title="Fees collected"
          icon={<Image src="/icons/cash-fill.svg" width={17} height={17} alt="Icon" />}
          value="₦200,280"
          color="var(--color-green-500)"
          iconBg="var(--teal-100)"
          percentage="+58%"
        />
        <OverviewCard
          title="outstanding fees"
          icon={<Image src="/icons/alert-fill.svg" width={17} height={17} alt="Icon" />}
          value="₦50,000"
          color="var(--color-green-500)"
          percentage="+100%"
          iconBg="var(--yellow-100)"
        />
        <OverviewCard
          title="students"
          icon={<Image src="/icons/user-fill.svg" width={10} height={10} alt="Icon" style={{ textAlign: "center", display: "flex" }} />}
          value="₦50,000"
          color="var(--red-500)"
          percentage="-10%"
          iconBg="var(--sky-100)"
        />

        <OverviewCard
          title="Expenses"
          icon={<Image src="/icons/indeterminate-circle-fill.svg" width={17} height={17} alt="Icon" />}
          value="₦0"
          color=""
          percentage=""
          iconBg="var(--pink-100)"
        />
      </div>

      <div className="flex flex-col gap-3 min-[920px]:flex-row">
        <div className="border-border-default bg-bg-default w-full rounded-md border min-[920px]:w-[65%]">
          <Chart />
        </div>
        <div className="border-border-default bg-bg-default w-full overflow-hidden rounded-md border min-[920px]:h-111 min-[920px]:w-[35%]">
          <Alerts />
        </div>
      </div>
    </div>
  );
};
