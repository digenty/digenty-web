import { AddFee } from "@/components/Fees/AddFee";
import { Spinner } from "@/components/ui/spinner";
import React, { Suspense } from "react";

const feesAdd = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <AddFee />
    </Suspense>
  );
};

export default feesAdd;
