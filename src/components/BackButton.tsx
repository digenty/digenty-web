"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftS } from "@digenty/icons";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  className?: string;
}

export const BackButton = ({ className }: BackButtonProps) => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={cn("text-text-subtle hover:text-text-default flex w-fit cursor-pointer items-center gap-2 transition-colors", className)}
    >
      <ArrowLeftS fill="var(--color-icon-default-subtle)" className="h-5 w-5" />
      <span className="text-sm font-medium">Back</span>
    </button>
  );
};
