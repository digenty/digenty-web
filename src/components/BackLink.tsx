import Link from "next/link";
import { ArrowLeftS } from "@digenty/icons";
import { cn } from "@/lib/utils";

interface BackLinkProps {
  href: string;
  className?: string;
}

export const BackLink = ({ href, className }: BackLinkProps) => (
  <Link
    href={href}
    className={cn("text-text-subtle hover:text-text-default flex w-fit cursor-pointer items-center gap-2 transition-colors", className)}
  >
    <ArrowLeftS fill="var(--color-icon-default-subtle)" className="h-5 w-5" />
    <span className="text-sm font-medium">Back</span>
  </Link>
);
