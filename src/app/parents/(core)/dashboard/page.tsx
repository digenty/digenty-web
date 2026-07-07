import { Overview } from "@/components/ParentPortalComponents/Dashboard";
import { Spinner } from "@/components/ui/spinner";

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
