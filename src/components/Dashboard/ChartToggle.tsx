import React from "react";
import { Button } from "../ui/button";
import { ClassLevelWithBranch } from "@/api/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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
    <>
      <div className="bg-bg-state-soft hide-scrollbar hidden w-full max-w-full gap-4 overflow-x-auto rounded-full p-0.5 md:flex">
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

      <div className="block w-full md:hidden">
        <Select value={selected || (options[0]?.levelName ?? "")} onValueChange={handleSelect}>
          <SelectTrigger className="bg-bg-state-soft text-text-default h-10 w-full rounded-full border-0 px-4 capitalize">
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem key={option.id} value={option.levelName} className="capitalize">
                {option.levelName.replaceAll("_", " ").toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
