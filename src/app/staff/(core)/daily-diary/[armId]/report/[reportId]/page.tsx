import { PublishedReportGate } from "@/components/DailyDiary/PublishedReport/PublishedReportGate";

export default async function PublishedReportPage({ params }: { params: Promise<{ armId: string; reportId: string }> }) {
  const { armId, reportId } = await params;

  return <PublishedReportGate armId={armId} reportId={reportId} />;
}
