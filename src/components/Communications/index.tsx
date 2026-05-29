import { CampaignsTable } from "./CampaignsTable";
import { CommunicationsHeader } from "./CommunicationsHeader";
import { OverviewCards } from "./OverviewCards";
import { SearchAndFilter } from "./SearchAndFilter";

export const Communications = () => {
  return (
    <div className="space-y-4 px-4 pt-4 pb-8 md:space-y-6 md:px-8 md:pt-6 md:pb-12">
      <CommunicationsHeader />

      <OverviewCards />

      <SearchAndFilter />

      <CampaignsTable />
    </div>
  );
};
