import { WeeklyReportGate } from "@/components/DailyDiary/WeeklyReport/WeeklyReportGate";

export default async function WeeklyReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ armId: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [{ armId }, sp] = await Promise.all([params, searchParams]);

  return <WeeklyReportGate armId={armId} weekStart={sp.weekStart} />;
}
