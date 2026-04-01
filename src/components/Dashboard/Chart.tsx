"use client";
import { Branch, ClassLevelWithBranch, Term } from "@/api/types";
import { useGetLevels } from "@/hooks/queryHooks/useLevel";
import { extractUniqueLevelsByType } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { useChartData } from "../Chart/data";
import { Legend } from "../Chart/Legend";
import { StackedBarChart } from "../Chart/StackedBarChart";
import { Skeleton } from "../ui/skeleton";
import { ChartToggle } from "./ChartToggle";
import { PaymentFilter } from "./PaymentFilter";

export const Chart = ({ branchSelected }: { branchSelected: Branch | null }) => {
  const [selected, setSelected] = useState<string>("All Levels");
  const [termSelected, setTermSelected] = useState<Term | null>(null);

  const { data: levelsResponse, isPending: loadingLevels } = useGetLevels(branchSelected?.id);

  const levels = extractUniqueLevelsByType(levelsResponse?.data || []);

  const { data, isPending } = useChartData(levels);

  useEffect(() => {
    if (levels.length > 0 && (!selected || (!levels.find(l => l.levelName === selected) && selected !== "All Levels"))) {
      setSelected("All Levels");
    }
  }, [levels, selected]);

  const filteredData = useMemo(() => {
    if (selected === "All Levels") return data;
    return data.filter(item => item.level === selected);
  }, [data, selected]);

  return (
    <div className="space-y-4 rounded-md py-6 md:pt-5 md:pb-0">
      <div className="flex flex-col justify-between gap-3.5 px-3 md:flex-row md:items-center md:px-5">
        <PaymentFilter termSelected={termSelected} setTermSelected={setTermSelected} />
        <Legend />
      </div>

      {isPending ? (
        <Skeleton className="mt-4 h-[300px] w-full" />
      ) : (
        //  <StackedBarChart data={isMobile ? filteredData : data} />
        <StackedBarChart data={filteredData} />
      )}

      <div className="flex p-3">
        {levels.length > 0 && (
          <ChartToggle
            options={[{ id: "all", levelName: "All Levels" } as unknown as ClassLevelWithBranch, ...levels]}
            selected={selected}
            onChange={value => setSelected(value)}
          />
        )}
      </div>
    </div>
  );
};
