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
  modal?: boolean;
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
  modal = false,
}: SearchableSelectProps) => {
  const [searchValue, setSearchValue] = useState("");

  const filteredOptions = options.filter(option => option.label.toLowerCase().includes(searchValue.toLowerCase()));
  return (
    <Combobox
      value={value}
      onValueChange={val => {
        if (val) onValueChange(val);
      }}
      itemToStringLabel={val => {
        const selected = options.find(o => o.value === val);
        return selected ? selected.label : "";
      }}
      onInputValueChange={setSearchValue}
    >
      <ComboboxInput
        className={cn("bg-bg-input-soft! text-text-muted w-full rounded-md border-none text-sm! font-normal", className)}
        placeholder={placeholder}
        aria-label={placeholder}
        onBlur={() => {
          const selected = options.find(o => o.value === value);
          setSearchValue(selected ? selected.label : "");
        }}
      >
        {icon && <div className="ml-2 flex items-center">{icon}</div>}
      </ComboboxInput>
      <ComboboxContent portal={!modal} className="bg-bg-card z-50 border-none! shadow-lg">
        <ComboboxList>
          {filteredOptions.length === 0 && (
            <ComboboxEmpty className="text-text-destructive py-2 text-center text-sm font-light">{emptyMessage}</ComboboxEmpty>
          )}
          {filteredOptions.map((option, index) => (
            <ComboboxItem key={`${option.value}-${index}`} value={option.value} className="hover:bg-bg-state-ghost-hover hover:text-text-default">
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
