"use client";

import { ArrowGoBack, CloseCircle, DeleteBin, Edit, FileCopy } from "@digenty/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { CampaignDetailDto } from "@/api/campaign";
import { toast } from "@/components/Toast";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import {
  useCancelCampaignSchedule,
  useDeleteCampaign,
  useDuplicateCampaign,
  useGetCampaign,
  usePayForCampaign,
  useResendCampaign,
} from "@/hooks/queryHooks/useCampaign";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

import { Button } from "../../ui/button";
import { DeleteCampaignModal } from "../DeleteCampaignModal";
import { extractPaymentUrl } from "../types";

type CampaignDetailHeaderProps = {
  campaign: CampaignDetailDto;
};

const getErrorMessage = (error: unknown) => (error as { message?: string })?.message ?? "Please try again.";

export const CampaignDetailHeader = ({ campaign }: CampaignDetailHeaderProps) => {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { email: userEmail, isUserLoading } = useLoggedInUser();
  const { refetch: refetchCampaign } = useGetCampaign(campaign.id);
  const deleteMutation = useDeleteCampaign();
  const duplicateMutation = useDuplicateCampaign();
  const resendMutation = useResendCampaign();
  const payMutation = usePayForCampaign();
  const cancelScheduleMutation = useCancelCampaignSchedule();

  useBreadcrumb([
    { label: "Communications", url: "/staff/communications" },
    { label: "Campaign Details", url: "" },
  ]);

  const handleDelete = () => {
    deleteMutation.mutate(campaign.id, {
      onSuccess: () => {
        toast({ title: "Campaign deleted", description: campaign.title, type: "success" });
        setDeleteOpen(false);
        router.push("/staff/communications");
      },
      onError: (error: unknown) => toast({ title: "Failed to delete campaign", description: getErrorMessage(error), type: "error" }),
    });
  };

  const handlePay = () => {
if (!userEmail) {
      toast({ title: "Unable to process payment", description: "User email not available. Please try again.", type: "error" });
      return;
    }
    payMutation.mutate(
      { id: campaign.id, payload: { email: userEmail, callbackUrl: `${window.location.origin}/staff/communications/${campaign.id}` } },
      {
        onSuccess: response => {
          const url = extractPaymentUrl(response);
          if (url) {
            window.location.href = url;
            return;
          }
          toast({ title: "Payment initiated", description: campaign.title, type: "success" });
          refetchCampaign();
        },
        onError: (error: unknown) => toast({ title: "Payment failed", description: getErrorMessage(error), type: "error" }),
      },
    );
  };

  const handleResend = () => {
    resendMutation.mutate(
      { id: campaign.id, payload: { email: userEmail, callbackUrl: `${window.location.origin}/staff/communications/${campaign.id}` } },
      {
        onSuccess: response => {
          const url = extractPaymentUrl(response);
          if (url) {
            window.location.href = url;
            return;
          }
          toast({ title: "Campaign resent", description: campaign.title, type: "success" });
        },
        onError: (error: unknown) => toast({ title: "Failed to resend campaign", description: getErrorMessage(error), type: "error" }),
      },
    );
  };

  const handleDuplicate = () => {
    duplicateMutation.mutate(campaign.id, {
      onSuccess: created => {
        toast({ title: "Campaign duplicated", description: campaign.title, type: "success" });
        if (created?.id) router.push(`/staff/communications/${created.id}/edit`);
      },
      onError: (error: unknown) => toast({ title: "Failed to duplicate campaign", description: getErrorMessage(error), type: "error" }),
    });
  };

  const handleCancelSchedule = () => {
    cancelScheduleMutation.mutate(campaign.id, {
      onSuccess: () => toast({ title: "Schedule cancelled", description: campaign.title, type: "success" }),
      onError: (error: unknown) => toast({ title: "Failed to cancel schedule", description: getErrorMessage(error), type: "error" }),
    });
  };

  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-text-default text-xl font-semibold">{campaign.title}</h1>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            aria-label="Delete campaign"
            onClick={() => setDeleteOpen(true)}
            className="bg-bg-state-secondary border-border-darker text-text-default flex size-8 items-center justify-center border p-0"
          >
            <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
          </Button>

          {campaign.status === "PENDING_PAYMENT" && !campaign.paid && (
            <Button
              onClick={handlePay}
              disabled={payMutation.isPending || isUserLoading || !userEmail}
              className="flex h-8 items-center gap-1 bg-primary px-2.5 py-1.5 text-sm font-medium text-white"
            >
              {payMutation.isPending ? "Processing…" : `Pay ₦${campaign.totalCost.toLocaleString()}`}
            </Button>
          )}

          {campaign.status === "SCHEDULED" && (
            <Button
              onClick={handleCancelSchedule}
              disabled={cancelScheduleMutation.isPending}
              className="bg-bg-state-secondary text-text-default border-border-darker flex h-8 items-center gap-1 border px-2.5 py-1.5 text-sm font-medium"
            >
              <CloseCircle fill="var(--color-icon-default-muted)" className="size-4" />
              Cancel Schedule
            </Button>
          )}

          <Button
            onClick={handleResend}
            disabled={resendMutation.isPending}
            className="bg-bg-state-secondary text-text-default border-border-darker flex h-8 items-center gap-1 border px-2.5 py-1.5 text-sm font-medium"
          >
            <ArrowGoBack fill="var(--color-icon-default-muted)" className="size-4" />
            Resend
          </Button>
          <Button
            onClick={handleDuplicate}
            disabled={duplicateMutation.isPending}
            className="bg-bg-state-secondary text-text-default border-border-darker flex h-8 items-center gap-1 border px-2.5 py-1.5 text-sm font-medium"
          >
            <FileCopy fill="var(--color-icon-default-muted)" className="size-4" />
            Duplicate
          </Button>
          <Button
            onClick={() => router.push(`/staff/communications/${campaign.id}/edit`)}
            className="bg-bg-state-secondary text-text-default border-border-darker flex h-8 items-center gap-1 border px-2.5 py-1.5 text-sm font-medium"
          >
            <Edit fill="var(--color-icon-default-muted)" className="size-4" />
            Edit
          </Button>
        </div>
      </div>

      <DeleteCampaignModal open={deleteOpen} setOpen={setDeleteOpen} onDelete={handleDelete} loading={deleteMutation.isPending} />
    </>
  );
};
