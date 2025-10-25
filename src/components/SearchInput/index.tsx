import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export const SearchInput = ({ className, placeholder = "Search" }: { className?: string; placeholder?: string }) => {
  return (
    <InputGroup className={cn("pr-1", className)}>
      <InputGroupInput className="text-text-muted" placeholder={placeholder} />
      <InputGroupAddon>
        <Search className="text-icon-default-muted" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Button className="border-border-default size-5 border px-2">
          <span className="text-text-muted text-xs font-medium">/</span>
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
};
