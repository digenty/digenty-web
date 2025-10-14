"use client";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import { Tooltip as CustomTooltip } from "./Tooltip";
import { data } from "./data";

export const StackedBarChart = () => {
  return (
    <div className="bg-default-transparent/0.01 h-[500px] w-full p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          barCategoryGap="15%" // Adjust gap between bar groups
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          {/* Dotted lines for vertical grid only */}
          <CartesianGrid vertical={false} stroke="#27272A1A" />

          <XAxis dataKey="name" stroke="#A0AEC0" padding={{ left: 10, right: 10 }} />

          {/* Y-Axis for percentage (0% to 100%) */}
          <YAxis
            type="number"
            domain={[0, 100]} // Fixed domain for percentage scale
            tickFormatter={value => `${value}%`} // Format as percentage
            stroke="#A0AEC0"
            orientation="left"
            tickLine={false}
          />

          {/* Custom Tooltip matching the design */}
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#fff", strokeDasharray: "3 3" }} />

          {/* Legend for 'Paid' and 'Unpaid' (Optional, as the tooltip is key) */}
          <Legend layout="horizontal" verticalAlign="top" align="right" wrapperStyle={{ color: "#A0AEC0", paddingTop: "10px" }} />

          <Bar
            dataKey="paid"
            stackId="a" // what makes it stack
            fill="#3B82F6" // Tailwind blue-500 or blue-600
            unit=""
          />

          <Bar dataKey="unpaid" stackId="a" fill="#D1D5DB" unit="" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
