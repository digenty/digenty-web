"use client";

import { ArrowGoBack, DeleteBin, Edit, FileCopy } from "@digenty/icons";
import { Ellipsis, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { CampaignChannel, CampaignResponseDto, CampaignStatus } from "@/api/campaign";
import { toast } from "@/components/Toast";
import { useDeleteCampaign, useDuplicateCampaign, useGetCampaigns, useResendCampaign } from "@/hooks/queryHooks/useCampaign";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

import { DataTable } from "../DataTable";
import { ErrorComponent } from "../Error/ErrorComponent";
import { MobileDrawer } from "../MobileDrawer";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

import { ChannelLabel } from "./ChannelLabel";
import { campaignColumns } from "./Column";
import { DeleteCampaignModal } from "./DeleteCampaignModal";
import { getCampaignStatusBadge } from "./StatusBadge";
import { extractPaymentUrl, formatCampaignDate } from "./types";
import { PageEmptyState } from "../Error/PageEmptyState";

const PAGE_SIZE = 20;

type Props = {
  search?: string;
  status?: CampaignStatus;
  channel?: CampaignChannel;
  termId?: number;
  page: number;
  onPageChange: (page: number) => void;
};

export const CampaignsTable = ({ search, status, channel, termId, page, onPageChange }: Props) => {
  const router = useRouter();
  const user = useLoggedInUser();
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<CampaignResponseDto[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<CampaignResponseDto | null>(null);
  const [campaignToDelete, setCampaignToDelete] = useState<CampaignResponseDto | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  const { data, isLoading, isError, refetch } = useGetCampaigns({ page, pageSize: PAGE_SIZE, search: search || undefined, status, channel, termId });
  const deleteMutation = useDeleteCampaign();
  const duplicateMutation = useDuplicateCampaign();
  const resendMutation = useResendCampaign();

  const campaigns = data?.campaigns ?? [];
  const totalCount = data?.total ?? 0;

  const handleDelete = () => {
    if (!campaignToDelete) return;
    deleteMutation.mutate(campaignToDelete.id, {
      onSuccess: () => {
        toast({ title: "Campaign deleted", description: campaignToDelete.title, type: "success" });
        setDeleteOpen(false);
        setCampaignToDelete(null);
      },
      onError: (error: unknown) =>
        toast({ title: "Failed to delete campaign", description: (error as { message?: string })?.message ?? "Please try again.", type: "error" }),
    });
  };

  const handleDuplicate = (campaign: CampaignResponseDto) => {
    duplicateMutation.mutate(campaign.id, {
      onSuccess: () => toast({ title: "Campaign duplicated", description: campaign.title, type: "success" }),
      onError: (error: unknown) =>
        toast({ title: "Failed to duplicate campaign", description: (error as { message?: string })?.message ?? "Please try again.", type: "error" }),
    });
  };

  const handleResend = (campaign: CampaignResponseDto) => {
    resendMutation.mutate(
      { id: campaign.id, payload: { email: user.email ?? "", callbackUrl: `${window.location.origin}/staff/communications` } },
      {
        onSuccess: response => {
          const url = extractPaymentUrl(response);
          if (url) {
            window.location.href = url;
            return;
          }
          toast({ title: "Campaign resent", description: campaign.title, type: "success" });
        },
        onError: (error: unknown) =>
          toast({ title: "Failed to resend campaign", description: (error as { message?: string })?.message ?? "Please try again.", type: "error" }),
      },
    );
  };

  if (isLoading) {
    return (
      <div>
        <div className="hidden md:block">
          <div className="border-border-default overflow-hidden rounded-md border">
            <Skeleton className="bg-bg-input-soft h-100 w-full! rounded" />

            {/* {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="grid grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, j) => (
                  <Skeleton key={j} className="bg-bg-input-soft h-4 rounded" />
                ))}
              </div>
            ))} */}
          </div>
        </div>

        <div className="flex flex-col gap-4 md:hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="bg-bg-input-soft h-30 w-full! rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border-border-default flex w-full justify-center rounded-md border py-12">
        <ErrorComponent
          title="Couldn't load campaigns"
          description="Something went wrong while loading your campaigns. Please try again."
          buttonText="Try again"
          onClick={() => refetch()}
        />
      </div>
    );
  }

  if (!isLoading && campaigns.length === 0) {
    return (
      <div className="border-border-default flex w-full justify-center rounded-md border py-12">
        <PageEmptyState
          title="No campaigns yet"
          description="You haven't created any campaigns. Start by creating your first campaign."
          buttonText="New Campaign"
          url="/staff/communications/new"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="hidden md:block">
        <DataTable
          columns={campaignColumns}
          data={campaigns}
          totalCount={totalCount}
          page={page}
          setCurrentPage={onPageChange}
          pageSize={PAGE_SIZE}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onSelectRows={setSelectedRows}
          loadingContent={false}
          clickHandler={row => router.push(`/staff/communications/${row.original.id}`)}
          showPagination={true}
        />
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        {campaigns.slice(0, visibleCount).map(campaign => (
          <div
            key={campaign.id}
            className="border-border-default bg-bg-subtle cursor-pointer rounded-md border"
            onClick={() => router.push(`/staff/communications/${campaign.id}`)}
          >
            <div className="flex h-9.5 items-center justify-between px-3 py-1.5">
              <span className="text-text-default text-sm font-medium">{campaign.title}</span>
              <Button
                onClick={evt => {
                  evt.stopPropagation();
                  setActiveCampaign(campaign);
                }}
                className="text-text-muted cursor-pointer p-0! focus-visible:ring-0!"
              >
                <Ellipsis className="size-5" />
              </Button>
            </div>

            <div className="border-border-default border-t">
              <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                <span className="text-text-muted font-medium">Date</span>
                <span className="text-text-default font-medium">{formatCampaignDate(campaign.createdAt)}</span>
              </div>

              <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                <span className="text-text-muted font-medium">Channel</span>
                <ChannelLabel channel={campaign.channel} />
              </div>

              <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                <span className="text-text-muted font-medium">Recipients</span>
                <span className="text-text-default font-medium">{campaign.intendedRecipientCount}</span>
              </div>

              <div className="flex justify-between px-3 py-2 text-sm">
                <span className="text-text-muted font-medium">Status</span>
                {getCampaignStatusBadge(campaign.status)}
              </div>
            </div>
          </div>
        ))}

        {visibleCount < campaigns.length && (
          <Button
            onClick={() => setVisibleCount(campaigns.length)}
            className="bg-bg-state-soft text-text-subtle mx-auto my-2 flex w-39 items-center justify-center rounded-md"
          >
            Load More
          </Button>
        )}

        <MobileDrawer open={!!activeCampaign} setIsOpen={() => setActiveCampaign(null)} title="Actions">
          <div className="flex w-full flex-col gap-2 px-3 py-4">
            <div
              role="button"
              onClick={() => activeCampaign && router.push(`/staff/communications/${activeCampaign.id}`)}
              className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
            >
              <Eye className="size-4" /> View campaign
            </div>
            <div
              role="button"
              onClick={() => activeCampaign && router.push(`/staff/communications/${activeCampaign.id}/edit`)}
              className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
            >
              <Edit fill="var(--color-icon-default-subtle)" className="size-4" /> Edit campaign
            </div>
            <div
              role="button"
              onClick={() => {
                const campaign = activeCampaign;
                setActiveCampaign(null);
                if (campaign) handleDuplicate(campaign);
              }}
              className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-md border p-2 text-sm"
            >
              <FileCopy fill="var(--color-icon-default-subtle)" className="size-4" /> Duplicate
            </div>
            <div
              role="button"
              onClick={() => {
                const campaign = activeCampaign;
                setActiveCampaign(null);
                if (campaign) handleResend(campaign);
              }}
              className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-md border p-2 text-sm"
            >
              <ArrowGoBack fill="var(--color-icon-default-subtle)" className="size-4" /> Resend
            </div>
            <div
              role="button"
              onClick={() => {
                const campaign = activeCampaign;
                setActiveCampaign(null);
                setCampaignToDelete(campaign);
                setDeleteOpen(true);
              }}
              className="hover:bg-bg-muted border-border-darker flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-md border p-2 text-sm text-red-600"
            >
              <DeleteBin fill="var(--color-icon-destructive)" className="size-4" /> Delete campaign
            </div>
          </div>
        </MobileDrawer>
      </div>

      <DeleteCampaignModal open={deleteOpen} setOpen={setDeleteOpen} onDelete={handleDelete} loading={deleteMutation.isPending} />

      {selectedRows.length > 0 && (
        <div className="text-text-muted mt-2 text-xs">
          {selectedRows.length} of {totalCount} selected
        </div>
      )}
    </div>
  );
};
