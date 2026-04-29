import Link from "next/link";
import { ArrowLeftS } from "@/components/Icons/ArrowLeftS";

interface SubscriptionBackLinkProps {
  href: string;
}

export const SubscriptionBackLink = ({ href }: SubscriptionBackLinkProps) => (
  <Link href={href} className="text-text-subtle hover:text-text-default flex w-fit cursor-pointer items-center gap-2 transition-colors">
    <ArrowLeftS fill="var(--color-icon-default-subtle)" className="h-5 w-5" />
    <span className="text-sm font-medium">Back</span>
  </Link>
);
