import { Spinner } from "@/components/ui/spinner";
import { BioDatas } from "@/parentComponents/BioData";
import React, { Suspense } from "react";

const BioDataPage = () => {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <BioDatas />
      </Suspense>
    </div>
  );
};

export default BioDataPage;
