import React from "react";
import { SchoolOption } from "../../types";
import { Button } from "../ui/button";

interface ToggleGroupProps {
  options: SchoolOption[];
  selected?: string;
  onChange?: (value: SchoolOption) => void;
}

export const ChartToggle: React.FC<ToggleGroupProps> = ({ options, selected, onChange }) => {
  const handleSelect = (option: SchoolOption) => {
    onChange?.(option);
  };

  return (
    <div className="bg-bg-state-soft flex h-9 w-full rounded-full">
      {options.map(option => (
        <Button
          variant="ghost"
          key={option}
          onClick={() => handleSelect(option)}
          className={`w-1/3 rounded-full px-6 py-0.5 text-sm font-medium transition-all duration-300 ${
            selected === option ? "text-text-default shadow-light border-border-darker bg-bg-state-secondary" : "text-text-muted"
          }`}
        >
          {option}
        </Button>
      ))}
    </div>
  );
};
