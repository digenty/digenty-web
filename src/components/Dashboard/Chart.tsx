"use client";
import { StackedBarChart } from "../Chart/StackedBarChart";
import { Legend } from "../Chart/Legend";
import { PaymentFilter } from "./PaymentFilter";

export const Chart = () => {
  return (
    <div>
      <div className="flex justify-between px-10 gap-3.5 md:items-center flex-col md:flex-row">
        <PaymentFilter />
        <Legend />
      </div>
      <StackedBarChart />
    </div>
  );
};
