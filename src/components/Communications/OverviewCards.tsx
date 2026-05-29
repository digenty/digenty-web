import { Mail, Megaphone, Message3, PhoneFill } from "@digenty/icons";

import { OverviewCard } from "../OverviewCard";
import { mockOverviewStats } from "./mockData";

export const OverviewCards = () => {
  return (
    <div className="grid w-full grid-cols-2 gap-3 lg:grid-cols-4">
      <OverviewCard
        title="Total Campaign Sent"
        Icon={() => (
          <div className="bg-bg-basic-blue-subtle border-bg-basic-blue-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
            <Megaphone fill="var(--color-icon-default)" />
          </div>
        )}
        value={mockOverviewStats.totalCampaigns}
      />

      <OverviewCard
        title="SMS Campaigns"
        Icon={() => (
          <div className="bg-bg-basic-orange-subtle border-bg-basic-orange-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
            <Message3 fill="var(--color-icon-default)" />
          </div>
        )}
        value={mockOverviewStats.smsCampaigns}
      />

      <OverviewCard
        title="Email Campaigns"
        Icon={() => (
          <div className="bg-bg-basic-violet-subtle border-bg-basic-violet-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
            <Mail fill="var(--color-icon-default)" />
          </div>
        )}
        value={mockOverviewStats.emailCampaigns}
      />

      <OverviewCard
        title="Whatsapp Campaigns"
        Icon={() => (
          <div className="bg-bg-basic-green-subtle border-bg-basic-green-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
            <PhoneFill fill="var(--color-icon-default)" />
          </div>
        )}
        value={mockOverviewStats.whatsappCampaigns}
      />
    </div>
  );
};
