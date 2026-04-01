import { ClassInLevelDetails, ClassLevel } from "@/api/types";
import { useMemo } from "react";
import { ChartData } from "./types";
import { useQueries } from "@tanstack/react-query";
import { getClassesByLevel } from "@/api/class";
import { classKeys } from "@/queries/class";

export const useChartData = (levels: ClassLevel[]) => {
  const queries = useQueries({
    queries: levels.map(level => ({
      queryKey: [classKeys.classesByLevel, level.id],
      queryFn: () => getClassesByLevel(level.id),
      enabled: !!level.id,
    })),
  });

  const isPending = queries.some(q => q.isPending);

  const data: ChartData[] = useMemo(() => {
    if (isPending || levels.length === 0) return [];

    return levels.flatMap((level, index) => {
      const classesResponse = queries[index].data;
      const classes = classesResponse?.data?.content || [];

      return classes.map((cls: ClassInLevelDetails) => {
        // Generating mock numbers that sum up logically
        // const paidPercent = Math.floor(Math.random() * 60) + 20; // 20 to 80
        const paidPercent = 0;
        const unpaidPercent = 100 - paidPercent;
        const totalAmount = Math.floor(Math.random() * 100000) + 50000;

        return {
          name: cls.className,
          paid_abs: Math.floor((paidPercent / 100) * totalAmount),
          paid: paidPercent,
          unpaid: unpaidPercent,
          unpaid_abs: Math.floor((unpaidPercent / 100) * totalAmount),
          total: totalAmount,
          level: level.levelName,
        };
      });
    });
  }, [levels, queries, isPending]);

  return { data, isPending };
};
