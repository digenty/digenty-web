import { InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { DetailedHTMLProps, InputHTMLAttributes, JSX } from "react";
import { Button } from "../ui/button";

export const SearchInput = ({
  className,
  placeholder = "Search",
  ...props
}: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>): JSX.Element => {
  return (
    <div
      className={cn(
        "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-border-highlight flex pr-1 has-[[data-slot=input-group-control]:focus-visible]:border-none has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-offset-2",
        className,
      )}
    >
      <InputGroupInput className="text-text-muted text-sm" placeholder={placeholder} {...props} />
      <InputGroupAddon>
        <Search className="text-icon-default-muted" />
      </InputGroupAddon>

      <InputGroupAddon align="inline-end">
        <Button type="button" className="border-border-default size-5 border px-2">
          <span className="text-text-muted text-xs font-medium">/</span>
        </Button>
      </InputGroupAddon>
    </div>
  );
};
