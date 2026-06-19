import { DomainMain } from "@/components/Domain";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

const DomainPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <DomainMain />
    </Suspense>
  );
};

export default DomainPage;
