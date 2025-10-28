import { Badge } from "../ui/badge";

export default function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Active: "bg-bg-badge-green text-green-700 border border-border-default rounded-sm",
    Graduated: "bg-blue-100 text-blue-700 border border-border-default rounded-sm",
    Withdrawn: "bg-red-100 text-red-700 border border-border-default rounded-sm",
    Perfect: "bg-bg-badge-fuchsia text-fuchsia-700 border border-border-default rounded-sm",
  };

  return <Badge className={colors[status]}>{status}</Badge>;
}
