"use client";

import React from "react";
import clsx from "clsx";

type DashProgressProps = {
  value: number;
  steps?: number;
  activeColor?: string;
  inactiveColor?: string;
};

export const DashProgress: React.FC<DashProgressProps> = ({
  value,
  steps = 10,
  activeColor = "bg-bg-basic-cyan-strong",
  inactiveColor = "bg-bg-basic-gray-alpha-10",
}) => {
  const activeSteps = Math.round((value / 100) * steps);

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: steps }).map((_, i) => (
        <div
          key={i}
          className={clsx("h-1 w-7 rounded-full transition-colors duration-300", i < activeSteps ? activeColor : inactiveColor)}
          style={{ width: "16px" }}
        />
      ))}
    </div>
  );
};
