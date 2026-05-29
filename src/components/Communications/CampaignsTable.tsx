"use client";

import { ArrowGoBack, DeleteBin, Edit, FileCopy } from "@digenty/icons";
import { Ellipsis, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { DataTable } from "../DataTable";
import { MobileDrawer } from "../MobileDrawer";
import { Button } from "../ui/button";

import { ChannelLabel } from "./ChannelLabel";
import { campaignColumns } from "./Column";
import { mockCampaigns } from "./mockData";
import { getCampaignStatusBadge } from "./StatusBadge";
import { Campaign } from "./types";

export const CampaignsTable = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<Campaign[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const pageSize = 50;

  return (
    <div>
      <div className="hidden md:block">
        <DataTable
          columns={campaignColumns}
          data={mockCampaigns}
          totalCount={mockCampaigns.length}
          page={page}
          setCurrentPage={setPage}
          pageSize={pageSize}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onSelectRows={setSelectedRows}
          clickHandler={row => router.push(`/staff/communications/${row.original.id}`)}
          showPagination={true}
        />
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        {mockCampaigns.slice(0, visibleCount).map(campaign => (
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
                <span className="text-text-default font-medium">{campaign.date}</span>
              </div>

              <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                <span className="text-text-muted font-medium">Channel</span>
                <ChannelLabel channel={campaign.channel} />
              </div>

              <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                <span className="text-text-muted font-medium">Recipients</span>
                <span className="text-text-default font-medium">{campaign.recipients}</span>
              </div>

              <div className="flex justify-between px-3 py-2 text-sm">
                <span className="text-text-muted font-medium">Status</span>
                {getCampaignStatusBadge(campaign.status)}
              </div>
            </div>
          </div>
        ))}

        {visibleCount < mockCampaigns.length && (
          <Button
            onClick={() => setVisibleCount(mockCampaigns.length)}
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
            <div className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm">
              <FileCopy fill="var(--color-icon-default-subtle)" className="size-4" /> Duplicate
            </div>
            <div className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm">
              <ArrowGoBack fill="var(--color-icon-default-subtle)" className="size-4" /> Resend
            </div>
            <div className="hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm text-red-600">
              <DeleteBin fill="var(--color-icon-destructive)" className="size-4" /> Delete campaign
            </div>
          </div>
        </MobileDrawer>
      </div>

      {selectedRows.length > 0 && (
        <div className="text-text-muted mt-2 text-xs">
          {selectedRows.length} of {mockCampaigns.length} selected
        </div>
      )}
    </div>
  );
};
