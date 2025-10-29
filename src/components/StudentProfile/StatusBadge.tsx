import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export default function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Active: "bg-bg-badge-green text-bg-basic-green-strong",
    Graduated: "bg-blue-100 text-blue-700",
    Withdrawn: "bg-red-100 text-red-700",
    Prefect: "bg-bg-badge-fuchsia text-bg-basic-fuchsia-strong",
  };

  return <Badge className={cn("border-border-default h-6 rounded-md border text-xs", colors[status])}>{status}</Badge>;
}
