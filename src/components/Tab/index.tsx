import { cn } from "@/lib/utils";
import React, { useState, ReactNode } from "react";

type TabItem = {
  label: string;

  content: ReactNode;
};

interface TabsProps {
  items: TabItem[];
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, className }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="">
      <div className={cn("h-9 w-full", className)}>
        <div className="bg-bg-state-soft flex w-full items-center justify-between gap-2.5 rounded-full p-0.5">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`transit flex justify-center px-4 py-2 text-sm font-medium sm:w-1/3 ${
                activeIndex === index
                  ? "bg-bg-state-secondary border-border-darker text-text-default flex h-8 items-center justify-between gap-1 rounded-full border shadow-sm"
                  : "text-text-muted flex h-8 items-center gap-1"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full">{items[activeIndex].content}</div>
    </div>
  );
};
