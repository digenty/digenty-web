import { EditCampaignGate } from "@/components/Communications/EditCampaign/EditCampaignGate";

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <EditCampaignGate id={id} />;
}
