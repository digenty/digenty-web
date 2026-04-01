import React from "react";
import { Button } from "../ui/button";
import { ClassLevelWithBranch } from "@/api/types";

interface ToggleGroupProps {
  options: ClassLevelWithBranch[];
  selected?: string;
  onChange?: (value: string) => void;
}

export const ChartToggle: React.FC<ToggleGroupProps> = ({ options, selected, onChange }) => {
  const handleSelect = (option: string) => {
    onChange?.(option);
  };

  return (
    <div className="bg-bg-state-soft hide-scrollbar flex max-w-190 gap-4 overflow-x-auto rounded-full p-0.5">
      {options.map(option => (
        <Button
          variant="ghost"
          key={option.id}
          onClick={() => handleSelect(option.levelName)}
          className={`w-auto rounded-full px-3! py-0.5 text-sm font-medium capitalize transition-all duration-300 ${
            selected === option.levelName ? "text-text-default shadow-xlight border-border-darker bg-bg-state-secondary" : "text-text-muted"
          }`}
        >
          {option.levelName.replaceAll("_", " ").toLowerCase()}
        </Button>
      ))}
    </div>
  );
};
