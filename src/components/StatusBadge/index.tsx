import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-bg-badge-green text-bg-basic-green-strong",
    graduated: "bg-blue-100 text-blue-700",
    withdrawn: "bg-red-100 text-red-700",
    inactive: "bg-bg-badge-fuchsia text-bg-basic-fuchsia-strong",
    suspended: "bg-red-100 text-red-700",
    total: "bg-bg-badge-fuchsia text-bg-basic-fuchsia-strong",
  };

  return (
    <Badge
      className={cn(
        "border-border-default h-6 rounded-md border text-xs capitalize",
        colors[status?.toLowerCase()] ?? "bg-bg-badge-fuchsia text-bg-basic-fuchsia-strong",
      )}
    >
      {status.toLowerCase()}
    </Badge>
  );
}
