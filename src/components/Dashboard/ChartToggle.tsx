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
    <div className="bg-bg-state-soft flex w-full rounded-full p-0.5">
      {options.map(option => (
        <Button
          variant="ghost"
          key={option}
          onClick={() => handleSelect(option)}
          className={`w-1/2 rounded-full px-6 py-0.5 text-sm font-medium transition-all duration-300 ${
            selected === option ? "text-text-default shadow-xlight border-border-darker bg-bg-state-secondary" : "text-text-muted"
          }`}
        >
          {option}
        </Button>
      ))}
    </div>
  );
};
