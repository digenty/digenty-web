import { CampaignDetail } from "@/components/Communications/CampaignDetail";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <CampaignDetail id={id} />
    </Suspense>
  );
}
