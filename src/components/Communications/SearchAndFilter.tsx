"use client";

import { Draft, Mail, Message3, PhoneFill, TimeFill } from "@digenty/icons";
import { Check, Plus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { CampaignChannel, CampaignStatus } from "@/api/campaign";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";

import { MobileDrawer } from "../MobileDrawer";
import { SearchInput } from "../SearchInput";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DrawerClose, DrawerFooter } from "../ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  status: CampaignStatus | undefined;
  onStatusChange: (value: CampaignStatus | undefined) => void;
  channel: CampaignChannel | undefined;
  onChannelChange: (value: CampaignChannel | undefined) => void;
};

const statusFilters: { icon: React.ReactNode; label: string; value: CampaignStatus }[] = [
  { icon: <Check className="text-icon-default-muted size-4" />, label: "Sent", value: "SENT" },
  { icon: <X className="text-icon-default-muted size-4" />, label: "Failed", value: "FAILED" },
  { icon: <TimeFill className="size-4" fill="var(--color-icon-default-muted)" />, label: "Scheduled", value: "SCHEDULED" },
  { icon: <Draft className="size-4" fill="var(--color-icon-default-muted)" />, label: "Draft", value: "DRAFT" },
];

const channelFilters: { icon: React.ReactNode; label: string; value: CampaignChannel }[] = [
  { icon: <Message3 className="size-4" fill="var(--color-icon-default-muted)" />, label: "SMS", value: "SMS" },
  { icon: <Mail className="size-4" fill="var(--color-icon-default-muted)" />, label: "Email", value: "EMAIL" },
  { icon: <PhoneFill className="size-4" fill="var(--color-icon-default-muted)" />, label: "WhatsApp", value: "WHATSAPP" },
];

export const SearchAndFilter = ({ search, onSearchChange, status, onStatusChange, channel, onChannelChange }: Props) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [openStatus, setOpenStatus] = useState(false);
  const [openMobileFilter, setOpenMobileFilter] = useState(false);

  // Mobile pending selections (applied on "Apply")
  const [pendingStatus, setPendingStatus] = useState<CampaignStatus | undefined>(status);
  const [pendingChannel, setPendingChannel] = useState<CampaignChannel | undefined>(channel);

  const handleOpenMobileFilter = () => {
    setPendingStatus(status);
    setPendingChannel(channel);
    setOpenMobileFilter(true);
  };

  const handleApplyMobile = () => {
    onStatusChange(pendingStatus);
    onChannelChange(pendingChannel);
    setOpenMobileFilter(false);
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
      <div className="flex items-center gap-1">
        <SearchInput
          className="border-border-default border text-sm"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search campaigns"
        />

        {/* Status filter — desktop */}
        <DropdownMenu open={openStatus} onOpenChange={setOpenStatus}>
          <DropdownMenuTrigger asChild>
            <Badge
              className={cn(
                "border-border-darker bg-bg-state-secondary text-text-muted hidden cursor-pointer items-center rounded-full border border-dashed md:flex",
              )}
            >
              <Image src="/staff/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} className="size-7 p-1.5" />
              {status ? statusFilters.find(f => f.value === status)?.label : "Status"}
            </Badge>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-bg-card border-border-default text-text-default hidden w-48 py-2.5 shadow-sm md:block">
            <div className="flex flex-col gap-1 px-1 py-2">
              {status && (
                <div
                  onClick={() => {
                    onStatusChange(undefined);
                    setOpenStatus(false);
                  }}
                  className="hover:bg-bg-state-ghost-hover text-text-destructive flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-xs"
                >
                  <X className="size-3.5" /> Clear
                </div>
              )}
              {statusFilters.map(item => (
                <div
                  key={item.value}
                  onClick={() => {
                    onStatusChange(item.value === status ? undefined : item.value);
                    setOpenStatus(false);
                  }}
                  className={cn(
                    "hover:bg-bg-state-ghost-hover flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-sm",
                    item.value === status && "bg-bg-state-active-soft font-medium",
                  )}
                >
                  {item.icon}
                  <span className="text-text-default font-normal">{item.label}</span>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between gap-1">
        <Button onClick={handleOpenMobileFilter} className="bg-bg-state-soft block size-7 rounded-md p-1.5 md:hidden">
          <Image src="/staff/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
        </Button>

        <Button
          onClick={() => router.push("/staff/communications/new")}
          className="bg-bg-state-primary hover:bg-bg-state-primary/90! text-text-white-default flex h-8 items-center gap-1 rounded-md px-3"
        >
          <Plus className="text-texticon-white-default size-4" />
          New Campaign
        </Button>
      </div>

      {isMobile && (
        <MobileDrawer open={openMobileFilter} setIsOpen={setOpenMobileFilter} title="Filter">
          <div className="flex w-full flex-col gap-5 px-6 py-4">
            <div>
              <p className="text-text-muted mb-2 text-xs font-medium uppercase">Status</p>
              <div className="flex flex-col gap-1">
                {statusFilters.map(item => (
                  <div
                    key={item.value}
                    onClick={() => setPendingStatus(item.value === pendingStatus ? undefined : item.value)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-sm",
                      item.value === pendingStatus && "bg-bg-state-active-soft font-medium",
                    )}
                  >
                    {item.icon}
                    <span className="text-text-default font-normal">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-text-muted mb-2 text-xs font-medium uppercase">Channel</p>
              <div className="flex flex-col gap-1">
                {channelFilters.map(item => (
                  <div
                    key={item.value}
                    onClick={() => setPendingChannel(item.value === pendingChannel ? undefined : item.value)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-sm",
                      item.value === pendingChannel && "bg-bg-state-active-soft font-medium",
                    )}
                  >
                    {item.icon}
                    <span className="text-text-default font-normal">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle h-8 rounded-md! px-2.5 py-1 text-sm font-medium">Cancel</Button>
              </DrawerClose>

              <Button
                onClick={handleApplyMobile}
                className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-8 rounded-md px-2.5 py-1 text-sm"
              >
                Apply
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      )}
    </div>
  );
};
