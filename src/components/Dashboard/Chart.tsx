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
    <div className="border-border-default bg-bg-default rounded-md border py-2">
      <div className="flex flex-col justify-between gap-3.5 px-10 md:flex-row md:items-center">
        <PaymentFilter />
        <Legend />
      </div>
      <StackedBarChart data={isMobile ? filteredData : data} />

      <div className="block md:hidden">
        <ChartToggle options={["Primary School", "Secondary School", "Tertiary School"]} selected={selected} onChange={value => setSelected(value)} />
      </div>
    </div>
  );
};
