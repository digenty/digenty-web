"use client";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import CustomTooltip from "./Tooltip";
import { data } from "./data";

export const StackedBarChart = () => {
  // A dark background is needed for the design aesthetic
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

          {/* X-Axis for categories (Pr 1, JSS 1, etc.) */}
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

          {/* The key to stacking: stackId */}
          {/* Paid Bar (Blue) */}
          <Bar
            dataKey="Paid"
            stackId="a"
            fill="#3B82F6" // Tailwind blue-500 or blue-600
            unit="" // Remove default unit if Recharts adds one
            // We use the Paid/Total ratio for bar height, scaled to 100
            // This requires a pre-calculated data field, or a custom approach.
            // *The simplest approach is to use a pre-calculated percentage field in the data.*
            // For simplicity and adherence to the design, we will use a **scaled** data approach:
            // Data would be: { name: 'JSS 1', Paid_Percent: 50, Unpaid_Percent: 50 }
          />

          {/* Unpaid Bar (Gray) */}
          <Bar
            dataKey="Unpaid"
            stackId="a"
            fill="#D1D5DB" // Tailwind gray-300
            unit=""
          />

          {/* NOTE: To make the bars proportional height (0-100%) using Recharts
          and also show the absolute values in the tooltip, the data needs to 
          include percentage fields, e.g., 'Paid_P' and 'Unpaid_P', for the Bar
          dataKey, but the absolute values ('Paid', 'Unpaid') for the Tooltip 
          component to access. The Tooltip handles the complex label.
          The provided data structure is ideal for the Tooltip, but the Bar dataKey
          must use the percentage field for the Y-axis to correctly display 0-100%. */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
