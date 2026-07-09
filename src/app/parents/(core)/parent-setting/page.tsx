import { ParentSettings } from "@/components/ParentPortalComponents/ParentSettings";
import { Spinner } from "@/components/ui/spinner";

import React, { Suspense } from "react";

const ParentSettingsPage = () => {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <ParentSettings />
      </Suspense>
    </div>
  );
};

export default ParentSettingsPage;
