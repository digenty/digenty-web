"use client";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useMemo, useState } from "react";
import { SchoolOption } from "../../types";
import { data } from "../Chart/data";
import { Legend } from "../Chart/Legend";
import { StackedBarChart } from "../Chart/StackedBarChart";
import { ChartToggle } from "./ChartToggle";
import { PaymentFilter } from "./PaymentFilter";

export const Chart = () => {
  // Data fetching happens here
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState<SchoolOption>("Primary School");
  const filteredData = useMemo(() => data.filter(item => item.group === selected), [selected]);

  return (
    <div className="space-y-4 rounded-md py-6 md:pb-0 md:pt-5">
      <div className="flex flex-col justify-between gap-3.5 px-3 md:flex-row md:items-center md:px-5">
        <PaymentFilter />
        <Legend />
      </div>

      <StackedBarChart data={isMobile ? filteredData : data} />

      <div className="block px-3 md:hidden">
        <ChartToggle options={["Primary School", "Secondary School"]} selected={selected} onChange={value => setSelected(value)} />
      </div>
    </div>
  );
};
