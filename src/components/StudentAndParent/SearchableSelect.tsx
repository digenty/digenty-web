"use client";

import { useState } from "react";
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ComboboxEmpty } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

interface SearchableSelectProps {
  options: { label: string; value: string; flag?: string }[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const SearchableSelect = ({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  icon,
  className,
}: SearchableSelectProps) => {
  const [searchValue, setSearchValue] = useState("");

  const filteredOptions = options.filter(option => option.label.toLowerCase().includes(searchValue.toLowerCase()));

  return (
    <Combobox
      value={value}
      onValueChange={val => {
        if (val) onValueChange(val);
      }}
      inputValue={searchValue}
      onInputValueChange={setSearchValue}
    >
      <ComboboxInput
        className={cn("bg-bg-input-soft! text-text-muted w-full rounded-md border-none text-sm font-normal", className)}
        placeholder={placeholder}
        aria-label={placeholder}
      >
        {icon && <div className="ml-2 flex items-center">{icon}</div>}
      </ComboboxInput>
      <ComboboxContent className="bg-bg-card z-50 border-none! shadow-lg">
        <ComboboxList>
          {/* <ComboboxEmpty className="py-6 text-center text-sm font-light text-text-destructive">
            {emptyMessage}
          </ComboboxEmpty> */}
          {filteredOptions.map(option => (
            <ComboboxItem key={option.value} value={option.value} className="hover:bg-bg-state-ghost-hover hover:text-text-default">
              <span className="flex items-center gap-2">
                {option.flag && <span>{option.flag}</span>}
                {option.label}
              </span>
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};
