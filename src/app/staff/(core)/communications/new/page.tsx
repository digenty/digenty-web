import { NewCampaign } from "@/components/Communications/NewCampaign";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function NewCampaignPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <NewCampaign />
    </Suspense>
  );
}
