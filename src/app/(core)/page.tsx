// export default function Dashboard({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return <div className="">{children}</div>;
// }

import Alerts from "@/components/Alert/Alerts";

import { OverviewCard } from "@/components/OverviewHead/OverviewCard";
import OverviewHeader from "@/components/OverviewHead/OverviewHeader";
import Image from "next/image";

export default function Dashboard() {
  return (
    <>
      <OverviewHeader />
      <div className="grid w-full grid-cols-2 gap-3 p-4 md:grid-cols-3 lg:grid-cols-4">
        <OverviewCard
          title="Fees collected"
          icon={<Image src="/icons/notification-2.svg" width={24} height={24} alt="Icon" />}
          value="₦200,280"
          color="var(--color-success)"
          iconBg="var(--color-success-light)"
          percentage="+58%"
        />
        <OverviewCard
          title="outstanding fees"
          icon={<Image src="/icons/wallet.svg" width={24} height={24} alt="Icon" />}
          value="₦50,000"
          color="var(--color-success)"
          percentage="+100%"
          iconBg="var(--color-warning-light)"
        />
        <OverviewCard
          title="students"
          icon={<Image src="/icons/notification-2.svg" width={24} height={24} alt="Icon" />}
          value="₦50,000"
          color="var(--color-danger)"
          percentage="-10%"
          iconBg="var(--color-danger-light)"
        />
        <OverviewCard
          title="Expenses"
          icon={<Image src="/icons/notification-2.svg" width={24} height={24} alt="Icon" />}
          value="₦0"
          color="var(--color-warning) "
          percentage="+58%"
        />
      </div>
      <Alerts />
    </>
  );
}
