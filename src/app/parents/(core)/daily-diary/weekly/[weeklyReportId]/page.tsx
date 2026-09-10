import { ParentDiaryReportGate } from "@/components/ParentPortalComponents/ParentDiary/ParentDiaryReportGate";

export default async function ParentWeeklyReportPage({ params }: { params: Promise<{ weeklyReportId: string }> }) {
  const { weeklyReportId } = await params;

  return <ParentDiaryReportGate reportId={weeklyReportId} kind="weekly" />;
}
