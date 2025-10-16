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
    <div className="bg-default-transparent/10 flex w-full justify-evenly rounded-full p-1">
      {options.map(option => (
        <button
          key={option}
          onClick={() => handleSelect(option)}
          className={`flex-1 rounded-full px-6 py-0.5 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
            selected === option ? "bg-zinc-00 text-zinc-950 shadow-sm" : "text-zinc-500 hover:text-gray-200"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
