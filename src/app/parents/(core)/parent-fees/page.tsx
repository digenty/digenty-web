import { ParentFees } from "@/components/ParentPortalComponents/ParentFees";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

const ParentFeesPage = () => {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <ParentFees />
      </Suspense>
    </div>
  );
};

export default ParentFeesPage;
