"use client";

import { useState } from "react";

import { CampaignChannel, CampaignStatus } from "@/api/campaign";
import useDebounce from "@/hooks/useDebounce";

import { CampaignsTable } from "./CampaignsTable";
import { CommunicationsHeader } from "./CommunicationsHeader";
import { OverviewCards } from "./OverviewCards";
import { SearchAndFilter } from "./SearchAndFilter";

export const Communications = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CampaignStatus | undefined>(undefined);
  const [channel, setChannel] = useState<CampaignChannel | undefined>(undefined);
  const [termId, setTermId] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: CampaignStatus | undefined) => {
    setStatus(value);
    setPage(1);
  };

  const handleChannelChange = (value: CampaignChannel | undefined) => {
    setChannel(value);
    setPage(1);
  };

  return (
    <div className="space-y-4 px-4 pt-4 pb-8 md:space-y-6 md:px-8 md:pt-6 md:pb-12">
      <CommunicationsHeader termId={termId} onTermChange={setTermId} />

      <OverviewCards />

      <SearchAndFilter
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        channel={channel}
        onChannelChange={handleChannelChange}
      />

      <CampaignsTable
        search={debouncedSearch}
        status={status}
        channel={channel}
        termId={termId}
        page={page}
        onPageChange={setPage}
      />
    </div>
  );
};
