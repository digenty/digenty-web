"use client";
import { Branch, Term } from "@/api/types";
import { useGetClassPaymentCompletion, useGetDashboardLevels } from "@/hooks/queryHooks/useDashboard";
import { useEffect, useState } from "react";
import { mapToChartData } from "../Chart/data";
import { Legend } from "../Chart/Legend";
import { StackedBarChart } from "../Chart/StackedBarChart";
import { Skeleton } from "../ui/skeleton";
import { ChartToggle, ChartToggleOption } from "./ChartToggle";
import { PaymentFilter } from "./PaymentFilter";

const ALL_LEVELS = "ALL";

export const Chart = ({ branchSelected }: { branchSelected: Branch | null }) => {
  const [selected, setSelected] = useState<string>(ALL_LEVELS);
  const [termSelected, setTermSelected] = useState<Term | null>(null);

  const { data: levels } = useGetDashboardLevels(branchSelected?.id ?? null);
  const levelType = selected === ALL_LEVELS ? undefined : selected;

  const { data: completion, isPending } = useGetClassPaymentCompletion(termSelected?.termId ?? null, branchSelected?.id ?? null, levelType);

  useEffect(() => {
    if (levels?.length && selected !== ALL_LEVELS && !levels.find(l => l.levelType === selected)) {
      setSelected(ALL_LEVELS);
    }
  }, [levels, selected]);

  const chartData = mapToChartData(completion);

  const toggleOptions: ChartToggleOption[] = [
    { id: ALL_LEVELS, label: "All Levels" },
    ...(levels ?? []).map(level => ({ id: level.levelType, label: level.name })),
  ];

  return (
    <div className="w-full min-w-0 space-y-4 rounded-md py-6 md:pt-5 md:pb-0">
      <div className="flex flex-col justify-between gap-3.5 px-3 md:flex-row md:items-center md:px-5">
        <PaymentFilter termSelected={termSelected} setTermSelected={setTermSelected} />
        <Legend
          totalPaid={completion?.totalPaid ?? 0}
          totalOutstanding={completion?.totalOutstanding ?? 0}
          paidPercentage={completion?.paidPercentage ?? 0}
          unpaidPercentage={completion?.unpaidPercentage ?? 0}
        />
      </div>

      {isPending ? <Skeleton className="mt-4 h-[300px] w-full" /> : <StackedBarChart data={chartData} />}

      <div className="flex p-3">
        {levels && levels.length > 0 && <ChartToggle options={toggleOptions} selected={selected} onChange={setSelected} />}
      </div>
    </div>
  );
};
