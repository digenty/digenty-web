import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import React from "react";

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export const SearchInput = ({ className, placeholder = "Search", ...props }: SearchInputProps) => {
  return (
    <InputGroup className={cn("pr-1", className)}>
      <InputGroupInput className="text-text-muted text-sm" placeholder={placeholder} {...props} />

      <InputGroupAddon>
        <Search className="text-icon-default-muted" />
      </InputGroupAddon>

      <InputGroupAddon align="inline-end">
        <Button type="button" className="border-border-default size-5 border px-2">
          <span className="text-text-muted text-xs font-medium">/</span>
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
};
