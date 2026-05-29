"use client";

import { ArrowGoBack, DeleteBin, Edit, FileCopy } from "@digenty/icons";
import { useRouter } from "next/navigation";

import { useBreadcrumb } from "@/hooks/useBreadcrumb";

import { Button } from "../../ui/button";

type CampaignDetailHeaderProps = {
  id: string;
  title: string;
};

export const CampaignDetailHeader = ({ id, title }: CampaignDetailHeaderProps) => {
  const router = useRouter();

  useBreadcrumb([
    { label: "Communications", url: "/staff/communications" },
    { label: "Campaign Details", url: "" },
  ]);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h1 className="text-text-default text-xl font-semibold">{title}</h1>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          aria-label="Delete campaign"
          className="bg-bg-state-secondary border-border-darker text-text-default flex size-8 items-center justify-center border p-0"
        >
          <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
        </Button>
        <Button className="bg-bg-state-secondary text-text-default border-border-darker flex h-8 items-center gap-1 border px-2.5 py-1.5 text-sm font-medium">
          <ArrowGoBack fill="var(--color-icon-default-muted)" className="size-4" />
          Resend
        </Button>
        <Button className="bg-bg-state-secondary text-text-default border-border-darker flex h-8 items-center gap-1 border px-2.5 py-1.5 text-sm font-medium">
          <FileCopy fill="var(--color-icon-default-muted)" className="size-4" />
          Duplicate
        </Button>
        <Button
          onClick={() => router.push(`/staff/communications/${id}/edit`)}
          className="bg-bg-state-secondary text-text-default border-border-darker flex h-8 items-center gap-1 border px-2.5 py-1.5 text-sm font-medium"
        >
          <Edit fill="var(--color-icon-default-muted)" className="size-4" />
          Edit
        </Button>
      </div>
    </div>
  );
};
