import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(({ className, ...props }, ref) => {
  return (
    <textarea
      data-slot="textarea"
      ref={ref}
      className={cn(
        "border-input placeholder:text-text-muted focus-visible:border-ring focus-visible:ring-border-highlight! focus-visible:outline-none! disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
