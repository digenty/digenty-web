"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Tooltip as CustomTooltip } from "./Tooltip";
import { ChartData } from "./types";

export const StackedBarChart = ({ data }: { data: ChartData[] }) => {
  return (
    <div className="h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="15%" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          {/* Dotted lines for vertical grid only */}
          <CartesianGrid vertical={false} stroke="var(--color-border-default)" />

          <XAxis dataKey="name" padding={{ left: 10, right: 10 }} tickLine={false} className="text-text-muted text-xs" />

          <YAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={value => `${value}%`}
            axisLine={false}
            orientation="left"
            tickLine={false}
            className="text-text-muted text-xs"
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "transparent" }} />

          {/* <Legend content={<CustomLegend />} layout="horizontal" verticalAlign="top" align="right" wrapperStyle={{ display: "flex", justifyContent: "flex-end" }} /> */}

          <Bar
            dataKey="paid"
            stackId="a" // what makes it stack
            fill="var(--color-bg-basic-blue-accent)"
            unit=""
            radius={[0, 0, 4, 4]}
          />

          <Bar dataKey="unpaid" stackId="a" fill="var(--color-bg-basic-gray-subtle2)" unit="" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
