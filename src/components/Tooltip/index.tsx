import { Tooltip as TooltipComponent, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ReactNode } from "react";

export const Tooltip = ({ Trigger, description }: { Trigger: ReactNode | string; description: string }) => {
  return (
    <TooltipComponent>
      <TooltipTrigger asChild>{Trigger}</TooltipTrigger>
      <TooltipContent>
        <p className="text-xs font-medium">{description}</p>
      </TooltipContent>
    </TooltipComponent>
  );
};
