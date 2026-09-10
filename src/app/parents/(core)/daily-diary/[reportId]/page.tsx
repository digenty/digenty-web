import { ParentDiaryReportGate } from "@/components/ParentPortalComponents/ParentDiary/ParentDiaryReportGate";

export default async function ParentDailyReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;

  return <ParentDiaryReportGate reportId={reportId} kind="daily" />;
}
