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
          icon={<Image src="/icons/cash-fill.svg" width={24} height={24} alt="Icon" />}
          value="₦200,280"
          color="var(--color-green-500)"
          iconBg="var(--green-200)"
          percentage="+58%"
        />
        <OverviewCard
          title="outstanding fees"
          icon={<Image src="/icons/Vector.svg" width={24} height={24} alt="Icon" />}
          value="₦50,000"
          color="var(--color-green-500)"
          percentage="+100%"
          iconBg="var(--orange-200)"
        />
        <OverviewCard
          title="students"
          icon={<Image src="/icons/Vector (1).svg" width={10} height={10} alt="Icon" style={{ textAlign: "center", display: "flex" }} />}
          value="₦50,000"
          color="var(--red-500)"
          percentage="-10%"
          iconBg="var(--blue-200)"
        />

        <OverviewCard
          title="Expenses"
          icon={<Image src="/icons/Vector (2).svg" width={24} height={24} alt="Icon" />}
          value="₦0"
          color=""
          percentage=""
          iconBg="var(--orange-50)"
        />
      </div>
      <div className=":grid-cols-[1fr] grid items-start gap-3 p-4 md:grid-cols-[1fr_430px]">
        <Chart />
        <Alerts />
      </div>
    </div>
  );
};
