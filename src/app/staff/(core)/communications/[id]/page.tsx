import { CampaignDetailGate } from "@/components/Communications/CampaignDetail/CampaignDetailGate";

export default async function CampaignDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const paymentReference = sp.reference ?? sp.trxref ?? null;

  return <CampaignDetailGate id={id} paymentReference={paymentReference} />;
}
