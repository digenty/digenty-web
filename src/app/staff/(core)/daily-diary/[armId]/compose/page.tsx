import { ComposeReportGate } from "@/components/DailyDiary/ComposeDailyReport/ComposeReportGate";

export default async function ComposeDailyReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ armId: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [{ armId }, sp] = await Promise.all([params, searchParams]);

  return <ComposeReportGate armId={armId} date={sp.date} />;
}
