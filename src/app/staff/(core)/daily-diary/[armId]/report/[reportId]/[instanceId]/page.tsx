import { InstanceReportGate } from "@/components/DailyDiary/PublishedReport/InstanceReportGate";

export default async function InstanceReportPage({ params }: { params: Promise<{ armId: string; reportId: string; instanceId: string }> }) {
  const { armId, reportId, instanceId } = await params;

  return <InstanceReportGate armId={armId} batchId={reportId} reportId={instanceId} />;
}
