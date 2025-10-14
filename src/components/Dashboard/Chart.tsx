"use client";
import { StackedBarChart } from "../Chart/StackedBarChart";
import { Legend } from "../Chart/Legend";
import { PaymentFilter } from "./PaymentFilter";

export const Chart = () => {
  return (
    <div>
      <div className="flex flex-col justify-between gap-3.5 px-10 md:flex-row md:items-center">
        <PaymentFilter />
        <Legend />
      </div>
      <StackedBarChart />
    </div>
  );
};
