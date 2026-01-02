import Image from "next/image";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export const AppleAuth = ({ className }: { className?: string }) => {
  return (
    <Button className={cn("bg-bg-state-secondary border-border-darker h-10 w-full rounded-md border", className)}>
      <Image src="/icons/apple.svg" width={14} height={14} alt="Google" />
      <span className="text-text-default text-sm font-medium">Continue with Apple</span>
    </Button>
  );
};
