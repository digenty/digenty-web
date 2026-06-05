"use client";

import { Mail, Megaphone, Message3, PhoneFill } from "@digenty/icons";

import { OverviewCard } from "../OverviewCard";
import { Skeleton } from "../ui/skeleton";
import { useGetCampaignOverview } from "@/hooks/queryHooks/useCampaign";
import { Badge } from "../ui/badge";

export const OverviewCards = () => {
  const { data, isLoading, isError, refetch } = useGetCampaignOverview();

  return (
    <div className="grid w-full grid-cols-2 gap-3 lg:grid-cols-4">
      <OverviewCard
        title="Total Campaign Sent"
        Icon={() => (
          <div className="bg-bg-basic-blue-subtle border-bg-basic-blue-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
            <Megaphone fill="var(--color-icon-default)" />
          </div>
        )}
        value={isLoading ? <Skeleton className="bg-bg-input-soft">0</Skeleton> : (data?.totalCampaignsSent ?? 0)}
      />

      <OverviewCard
        title="SMS Campaigns"
        Icon={() => (
          <div className="bg-bg-basic-orange-subtle border-bg-basic-orange-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
            <Message3 fill="var(--color-icon-default)" />
          </div>
        )}
        value={isLoading ? <Skeleton className="bg-bg-input-soft">0</Skeleton> : (data?.smsCampaigns ?? 0)}
      />

      <OverviewCard
        title="Email Campaigns"
        Icon={() => (
          <div className="bg-bg-basic-violet-subtle border-bg-basic-violet-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
            <Mail fill="var(--color-icon-default)" />
          </div>
        )}
        value={isLoading ? <Skeleton className="bg-bg-input-soft">0</Skeleton> : (data?.emailCampaigns ?? 0)}
      />

      <OverviewCard
        title="Whatsapp Campaigns"
        Icon={() => (
          <div className="bg-bg-basic-green-subtle border-bg-basic-green-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
            <PhoneFill fill="var(--color-icon-default)" />
          </div>
        )}
        value={<Badge className="border-border-default text-text-warning rounded-md border">Coming Soon</Badge>}
      />
    </div>
  );
};
