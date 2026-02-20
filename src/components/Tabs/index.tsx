"use client";

import { cn } from "@/lib/utils";
import React, { useState, ReactNode } from "react";

type TabItem = {
  label: string;

  content: ReactNode;
  icon?: ReactNode;
  activeIcon?: ReactNode;
};

interface TabsProps {
  items: TabItem[];
  className?: string;
  buttonClassName?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, className, buttonClassName }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="">
      <div className={cn("h-9 w-full", className)}>
        <div className="bg-bg-state-soft flex w-full items-center gap-2.5 rounded-full p-0.5">
          {items.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "transit flex flex-1 justify-center px-4 py-2 text-sm font-medium",
                  buttonClassName,
                  isActive
                    ? "bg-bg-state-secondary border-border-darker text-text-default flex h-8 items-center justify-center gap-1 rounded-full border shadow-sm"
                    : "text-text-muted flex h-8 items-center gap-1",
                )}
              >
                <span>{item.label}</span>
                {(isActive ? item.activeIcon : item.icon) && <span className="mr-1 flex items-center">{isActive ? item.activeIcon : item.icon}</span>}
              </button>
            );
          })}
        </div>
      </div>
      <div className="w-full">
        <div className="flex w-full">
          <div className="flex-1">{items[activeIndex].content}</div>
        </div>
      </div>
    </div>
  );
};
