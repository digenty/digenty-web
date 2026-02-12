import { EmptyFeesCollectionState } from "@/components/FeeCollection/EmptyState";
import { Spinner } from "@/components/ui/spinner";
import React, { Suspense } from "react";

const FessCollectionsPage = () => {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <EmptyFeesCollectionState />
      </Suspense>
    </div>
  );
};

export default FessCollectionsPage;
