import { ClassInLevelDetails, ClassLevel } from "@/api/types";
import { useGetClassesByLevel } from "@/hooks/queryHooks/useClass";
import { useMemo } from "react";
import { ChartData } from "./types";

export const useChartData = (level: ClassLevel | null) => {
  const { data: classesResponse, isPending: loadingClasses } = useGetClassesByLevel(level?.id);
  const classes = classesResponse?.data?.content || [];

  const isPending = loadingClasses;

  const data: ChartData[] = useMemo(() => {
    if (loadingClasses) return [];

    return classes.map((cls: ClassInLevelDetails) => {
      // Generating mock numbers that sum up logically
      const paidPercent = Math.floor(Math.random() * 60) + 20; // 20 to 80
      const unpaidPercent = 100 - paidPercent;
      const totalAmount = Math.floor(Math.random() * 100000) + 50000;

      return {
        name: cls.className,
        paid_abs: Math.floor((paidPercent / 100) * totalAmount),
        paid: paidPercent,
        unpaid: unpaidPercent,
        unpaid_abs: Math.floor((unpaidPercent / 100) * totalAmount),
        total: totalAmount,
        level: level?.levelName,
      };
    });
  }, [level, classes, loadingClasses]);

  return { data, isPending };
};
