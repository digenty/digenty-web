"use client";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useMemo, useState, useEffect } from "react";
import { useChartData } from "../Chart/data";
import { Legend } from "../Chart/Legend";
import { StackedBarChart } from "../Chart/StackedBarChart";
import { ChartToggle } from "./ChartToggle";
import { PaymentFilter } from "./PaymentFilter";
import { Skeleton } from "../ui/skeleton";
import { Branch, ClassLevel, Term } from "@/api/types";
import { useGetLevels } from "@/hooks/queryHooks/useLevel";
import { extractUniqueLevelsByType } from "@/lib/utils";

export const Chart = ({ branchSelected }: { branchSelected: Branch | null }) => {
  const isMobile = useIsMobile();

  const [selected, setSelected] = useState<string>("");
  const [termSelected, setTermSelected] = useState<Term | null>(null);
  const [activeLevel, setActiveLevel] = useState<ClassLevel | null>(null);

  const { data: levelsResponse, isPending: loadingLevels } = useGetLevels(branchSelected?.id);
  const levels = extractUniqueLevelsByType(levelsResponse?.data || []);

  useEffect(() => {
    if (levels.length > 0) {
      setActiveLevel(levels[0]);
    }
  }, [levelsResponse]);

  const { data, isPending } = useChartData(activeLevel);

  // const levels = useMemo(() => {
  //   return Array.from(new Set(data.map(item => item.level)));
  // }, [data]);

  useEffect(() => {
    if (levels.length > 0 && (!selected || !levels.find(l => l.levelName === selected))) {
      setSelected(levels[0].levelName);
    }
  }, [levels, selected]);

  const filteredData = useMemo(() => data.filter(item => item.level === selected), [data, selected]);

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

      {/* <div className="block px-3 md:hidden"> */}
      {levels.length > 0 && <ChartToggle options={levels} selected={selected} onChange={value => setSelected(value)} />}
      {/* </div> */}
    </div>
  );
};
