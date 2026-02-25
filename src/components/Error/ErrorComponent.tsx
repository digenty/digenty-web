"use client";
import { useRouter } from "next/navigation";
import { QuickReferenceAll } from "../Icons/QuickReferenceAll";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export const ErrorComponent = ({
  title,
  description,
  buttonText,
  url,
  buttonStyle,
}: {
  title: string;
  description: string;
  buttonText: string;
  url?: string;
  buttonStyle?: string;
}) => {
  const router = useRouter();
  return (
    <div className="flex max-w-80 flex-col items-center gap-4">
      <QuickReferenceAll />
      <p className="text-text-default text-lg font-medium">{title}</p>
      <p className="text-text-muted text-center text-xs font-normal">{description}</p>
      <Button
        onClick={() => router.push(url ?? "/")}
        className={cn("bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default rounded-sm px-4 py-2", buttonStyle)}
      >
        {buttonText}
      </Button>
    </div>
  );
};
