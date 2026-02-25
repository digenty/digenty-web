import { Check, CheckCheck, TriangleAlert, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { Draft } from "../Icons/Draft";

export const stockStatus = (status: string) => {
  switch (status) {
    case "Low Stock":
      return (
        <Badge className="bg-bg-badge-orange text-bg-basic-orange-strong border-border-default h-5 rounded-md text-xs font-medium">
          <span>Low Stock</span>
        </Badge>
      );
    case "Out of Stock":
      return (
        <Badge className="bg-bg-badge-red text-bg-basic-red-strong border-border-default h-5 rounded-md text-xs font-medium">
          <span>In Stock</span>
        </Badge>
      );
    case "In Stock":
      return (
        <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default h-5 rounded-md text-xs font-medium">
          <span>In Stock</span>
        </Badge>
      );

    default:
      return (
        <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default h-5 rounded-md text-xs font-medium">
          <span>In Stock</span>
        </Badge>
      );
  }
};

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "Paid":
      return (
        <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default h-5 rounded-md text-xs font-medium">
          <Check className="size-3" />
          <span>Paid</span>
        </Badge>
      );
    case "Active":
      return (
        <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default h-5 rounded-md text-xs font-medium">
          <span>Active</span>
        </Badge>
      );

    case "Successful":
      return (
        <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default h-5 rounded-md text-xs font-medium">
          <Check className="size-3" />
          <span>Successful</span>
        </Badge>
      );
    case "Unpaid":
      return (
        <Badge className="bg-bg-badge-red text-bg-basic-red-strong border-border-default h-5 rounded-md text-xs font-medium">
          <X className="size-3" />
          <span>Unpaid</span>
        </Badge>
      );
    case "Outstanding":
      return (
        <Badge className="bg-bg-badge-orange text-bg-basic-orange-strong border-border-default h-5 rounded-md text-xs font-medium">
          <TriangleAlert className="size-3" />
          <span>Outstanding</span>
        </Badge>
      );
    case "Pending":
      return (
        <Badge className="bg-bg-badge-orange text-bg-basic-orange-strong border-border-default h-5 rounded-md text-xs font-medium">
          <span>Pending</span>
        </Badge>
      );
    case "Fully Paid":
      return (
        <Badge className="bg-bg-badge-lime text-bg-basic-lime-strong border-border-default h-5 rounded-md text-xs font-medium">
          <CheckCheck className="size-3" />
          <span>Fully Paid</span>
        </Badge>
      );
    case "Draft":
      return (
        <Badge className="border-border-default bg-bg-badge-default text-text-subtle h-5 rounded-md text-xs font-medium">
          <Draft className="size-3" fill="var(--color-icon-default-muted)" />
          <span>Draft</span>
        </Badge>
      );
    case "Required":
      return (
        <Badge className="bg-bg-badge-fuchsia text-bg-basic-fuchsia-strong border-border-default h-5 rounded-md text-xs font-medium">
          <span>Required</span>
        </Badge>
      );
    default:
      return (
        <Badge className="bg-bg-badge-default text-text-subtle border-border-default h-5 rounded-md text-xs font-medium!">
          <span>Optional</span>
        </Badge>
      );
  }
};

export const staffStatusBadge = (status: string) => {
  const palette = [
    "bg-bg-badge-lime text-bg-basic-lime-strong",
    "bg-bg-badge-blue text-bg-basic-blue-strong",
    "bg-bg-badge-cyan text-bg-basic-cyan-strong",
    "bg-bg-badge-pink text-bg-basic-pink-strong",
    "bg-bg-badge-orange text-bg-basic-orange-strong",
    "bg-bg-badge-fuchsia text-bg-basic-fuchsia-strong",
    "bg-bg-badge-violet text-bg-basic-violet-strong",
  ];

  const hash = status.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = palette[hash % palette.length];

  return (
    <Badge className={`${colors} border-border-default h-5 rounded-md text-xs font-medium`}>
      <span>{status}</span>
    </Badge>
  );
};

export const paymentStatus = (status: string) => {
  switch (status) {
    case "Paid":
      return <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default h-5 rounded-md text-xs font-medium">Paid</Badge>;

    case "Failed":
      return (
        <Badge className="bg-bg-badge-red text-bg-basic-red-strong border-border-default h-5 rounded-md text-xs font-medium">
          <span>Failed</span>
        </Badge>
      );

    default:
      return <div className=""></div>;
  }
};
