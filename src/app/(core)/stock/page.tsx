import { StockMain } from "@/components/Stocks";
import { Spinner } from "@/components/ui/spinner";
import React, { Suspense } from "react";

const StockPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <StockMain />
    </Suspense>
  );
};

export default StockPage;
