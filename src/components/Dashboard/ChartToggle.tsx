import React from "react";
import { SchoolOption } from "../../types";

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
    <div className="bg-bg-state-soft flex h-9 w-full justify-evenly rounded-full">
      {options.map(option => (
        <button
          key={option}
          onClick={() => handleSelect(option)}
          className={`flex-1 rounded-full px-6 py-0.5 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
            selected === option ? "text-text-default shadow-light border-border-darker bg-bg-state-secondary" : "text-text-muted"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
