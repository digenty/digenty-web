"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { toast } from "@/components/Toast";
import { Spinner } from "@/components/ui/spinner";
import { useGetCampaign } from "@/hooks/queryHooks/useCampaign";

import { ErrorComponent } from "../../Error/ErrorComponent";
import { CampaignDetailHeader } from "./CampaignDetailHeader";
import { CampaignDetailStats } from "./CampaignDetailStats";

type CampaignDetailProps = {
  id: string;
  paymentReference?: string | null;
};

export const CampaignDetail = ({ id, paymentReference }: CampaignDetailProps) => {
  const router = useRouter();
  const numericId = Number(id);
  const { data: campaign, isLoading, isError, refetch } = useGetCampaign(Number.isNaN(numericId) ? undefined : numericId);

  const handledRef = useRef(false);
  useEffect(() => {
    if (!paymentReference || handledRef.current) return;
    handledRef.current = true;
    toast({ title: "Payment successful", description: "Your campaign is now queued for delivery.", type: "success" });
    refetch();
    router.replace(`/staff/communications/${id}`);
  }, [paymentReference, id, refetch, router]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner className="size-12" />
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="flex h-[60vh] items-center justify-center px-4">
        <ErrorComponent
          title="Campaign not found"
          description="We couldn't load this campaign. It may have been deleted or the link is invalid."
          buttonText="Back to Communications"
          url="/staff/communications"
          onClick={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5 px-4 pt-4 pb-10 md:space-y-6 md:px-8 md:pt-6">
      <CampaignDetailHeader campaign={campaign} />

      <CampaignDetailStats campaign={campaign} />

      <div className="flex flex-col gap-2">
        <h2 className="text-text-default text-sm font-semibold">Message Content</h2>
        <div className="border-border-default bg-bg-basic-blue-subtle rounded-md border p-4">
          <p className="text-text-default text-sm leading-relaxed">{campaign.message}</p>
        </div>
      </div>
    </div>
  );
};
