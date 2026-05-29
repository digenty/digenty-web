"use client";

import { getCampaignById } from "../mockData";
import { CampaignDetailHeader } from "./CampaignDetailHeader";
import { CampaignDetailStats } from "./CampaignDetailStats";

type CampaignDetailProps = {
  id: string;
};

export const CampaignDetail = ({ id }: CampaignDetailProps) => {
  const campaign = getCampaignById(id);

  if (!campaign) {
    return (
      <div className="px-4 py-6 md:px-8">
        <p className="text-text-muted text-sm">Campaign not found.</p>
      </div>
    );
  }

  const title = campaign.title || "PTA Reminder";

  return (
    <div className="space-y-5 px-4 pt-4 pb-10 md:space-y-6 md:px-8 md:pt-6">
      <CampaignDetailHeader id={campaign.id} title={title} />

      <CampaignDetailStats campaign={campaign} />

      <div className="flex flex-col gap-2">
        <h2 className="text-text-default text-sm font-semibold">Message Content</h2>
        <div className="border-border-default bg-bg-basic-blue-subtle rounded-md border p-4">
          <p className="text-text-default text-sm leading-relaxed">{campaign.messageContent}</p>
        </div>
      </div>
    </div>
  );
};
