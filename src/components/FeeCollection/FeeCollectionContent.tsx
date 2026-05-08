"use client";

import { EmptyFeesCollectionState } from "@/components/FeeCollection/EmptyState";
import { ConfiguredView } from "@/components/FeeCollection/ConfiguredView";
import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { Spinner } from "@/components/ui/spinner";
import { useGetFeeCollectionSetupStatus } from "@/hooks/queryHooks/useFeeCollection";

export const FeeCollectionContent = () => {
  const { data, isLoading, isError } = useGetFeeCollectionSetupStatus();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-16" />
      </div>
    );
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
