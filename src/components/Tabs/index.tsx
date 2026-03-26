"use client";

import React, { useState, ReactNode } from "react";

type TabItem = {
  label: string;
  content: ReactNode;
};

interface TabsProps {
  items: TabItem[];
}

export const Tabs: React.FC<TabsProps> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full">
      <div className="bg-bg-state-soft flex items-center justify-between rounded-full p-0.5">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`px-4 py-2 text-sm font-medium ${
              activeIndex === index
                ? "bg-bg-state-ghost border-border-darker text-text-default flex h-8 w-29 items-center justify-center gap-1 rounded-full border shadow-sm"
                : "text-text-muted flex h-8 w-29 items-center justify-center gap-1"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-4">{items[activeIndex].content}</div>
    </div>
  );
};
