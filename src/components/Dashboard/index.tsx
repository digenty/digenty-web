import Image from "next/image";
import Alerts from "../Alert/Alerts";
import { Chart } from "./Chart";
import { OverviewCard } from "../OverviewHead/OverviewCard";
import OverviewHeader from "../OverviewHead/OverviewHeader";

export const Dashboard = () => {
  return (
    <div>
      <OverviewHeader />
      <div className="grid w-full grid-cols-2 gap-3 p-4 md:grid-cols-3 lg:grid-cols-4">
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
      <div className=":grid-cols-[1fr] grid items-start gap-3 p-4 md:grid-cols-[1fr_430px]">
        <Chart />
        <Alerts />
      </div>
    </div>
  );
};
