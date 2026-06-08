import { CampaignDetail } from "@/components/Communications/CampaignDetail";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default async function CampaignDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const paymentReference = sp.reference ?? sp.trxref ?? null;

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <CampaignDetail id={id} paymentReference={paymentReference} />
    </Suspense>
  );
}
