"use client";

import { EmptyFeesCollectionState } from "@/components/FeeCollection/EmptyState";
import { ConfiguredView } from "@/components/FeeCollection/ConfiguredView";
import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { useGetFeeCollectionSetupStatus } from "@/hooks/queryHooks/useFeeCollection";
import { Skeleton } from "../ui/skeleton";

export const FeeCollectionContent = () => {
  const { data, isLoading, isError } = useGetFeeCollectionSetupStatus();

  if (isLoading) {
    return <Skeleton className="bg-bg-input-soft h-50 w-full" />;
  }

  if (isError) {
    return (
      <PageEmptyState
        title="Something went wrong"
        description="We could not load your fee collection setup. Please try again."
        buttonText="Retry"
        url="/staff/fee-collection"
      />
    );
  }

  if (data?.mode) {
    return <ConfiguredView config={data} />;
  }

  return <EmptyFeesCollectionState />;
};
