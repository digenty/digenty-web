"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Tooltip as CustomTooltip } from "./Tooltip";
import { ChartData } from "./types";

export const StackedBarChart = ({ data }: { data: ChartData[] }) => {
  return (
    <div className="bg-default-transparent/0.01 h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="15%" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          {/* Dotted lines for vertical grid only */}
          <CartesianGrid vertical={false} stroke="#27272A1A" />

          <XAxis dataKey="name" stroke="#A0AEC0" padding={{ left: 10, right: 10 }} tickLine={false} className="text-xs text-zinc-500" />

          <YAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={value => `${value}%`}
            stroke="#A0AEC0"
            axisLine={false}
            orientation="left"
            tickLine={false}
            className="text-xs text-zinc-500"
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "transparent" }} />

          {/* <Legend content={<CustomLegend />} layout="horizontal" verticalAlign="top" align="right" wrapperStyle={{ display: "flex", justifyContent: "flex-end" }} /> */}

          <Bar
            dataKey="paid"
            stackId="a" // what makes it stack
            fill="#437DFC"
            unit=""
            radius={[0, 0, 4, 4]}
          />

          <Bar dataKey="unpaid" stackId="a" fill="#DADADD" unit="" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
