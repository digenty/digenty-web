import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-bg-badge-green text-bg-basic-green-strong",
    published: "bg-bg-badge-green text-bg-basic-green-strong",
    unpublished: "bg-bg-badge-red text-bg-basic-red-strong",
    graduated: "bg-blue-100 text-blue-700",
    withdrawn: "bg-red-100 text-red-700",
    inactive: "bg-bg-badge-fuchsia text-bg-basic-fuchsia-strong",
    suspended: "bg-red-100 text-red-700",
    total: "bg-bg-badge-fuchsia text-bg-basic-fuchsia-strong",
    submitted: "bg-bg-badge-green text-bg-basic-green-strong",
    "in progress": "bg-bg-badge-orange text-bg-basic-orange-strong",
    "not submitted": "bg-bg-badge-red text-bg-basic-red-strong",
    "requested edit access": "bg-bg-badge-orange text-bg-basic-orange-strong",
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
