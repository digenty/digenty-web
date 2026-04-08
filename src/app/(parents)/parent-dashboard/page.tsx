import { Spinner } from "@/components/ui/spinner";
import { Overview } from "@/parentComponents/Dashboard";
import React, { Suspense } from "react";

const ParentDashboardPage = () => {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <Overview />
      </Suspense>
    </div>
  );
};

export default ParentDashboardPage;
