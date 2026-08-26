import { DomainPurchaseStatus } from "@/api/domain";

export const domainKeys = {
  check: ["checkDomainAvailability"] as const,
  purchaseAndConnect: ["purchaseAndConnectDomain"] as const,
  purchase: (purchaseId: string) => ["domainPurchase", purchaseId] as const,
  purchases: ["domainPurchases"] as const,
};

// In-flight: middleware keeps polling. Terminal success: LIVE. Everything else terminal is a
// failure, arriving as HTTP 200 — see DOMAIN_FAILURE_COPY for what each one means to the school.
export const DOMAIN_IN_FLIGHT_STATUSES: DomainPurchaseStatus[] = [
  "PENDING",
  "REGISTERING",
  "REGISTERED",
  "DNS_CONFIGURING",
  "DNS_CONFIGURED",
  "VERCEL_ATTACHING",
  "AWAITING_VERIFICATION",
];

export const isDomainPurchaseInFlight = (status: DomainPurchaseStatus) => DOMAIN_IN_FLIGHT_STATUSES.includes(status);
export const isDomainPurchaseLive = (status: DomainPurchaseStatus) => status === "LIVE";
export const isDomainPurchaseFailed = (status: DomainPurchaseStatus) => !isDomainPurchaseInFlight(status) && !isDomainPurchaseLive(status);

export const DOMAIN_STATUS_CONFIG: Record<DomainPurchaseStatus, { label: string; className: string }> = {
  PENDING: { label: "Starting", className: "bg-bg-badge-orange text-bg-basic-orange-strong" },
  REGISTERING: { label: "Registering domain", className: "bg-bg-badge-orange text-bg-basic-orange-strong" },
  REGISTERED: { label: "Domain registered", className: "bg-bg-badge-orange text-bg-basic-orange-strong" },
  DNS_CONFIGURING: { label: "Configuring DNS", className: "bg-bg-badge-orange text-bg-basic-orange-strong" },
  DNS_CONFIGURED: { label: "DNS configured", className: "bg-bg-badge-orange text-bg-basic-orange-strong" },
  VERCEL_ATTACHING: { label: "Connecting", className: "bg-bg-badge-orange text-bg-basic-orange-strong" },
  AWAITING_VERIFICATION: { label: "Awaiting verification", className: "bg-bg-badge-orange text-bg-basic-orange-strong" },
  LIVE: { label: "Live", className: "bg-bg-badge-green text-bg-basic-green-strong" },
  REJECTED: { label: "Rejected", className: "bg-bg-badge-red text-bg-basic-red-strong" },
  REGISTRATION_INDETERMINATE: { label: "Confirming with registrar", className: "bg-bg-badge-orange text-bg-basic-orange-strong" },
  DNS_FAILED: { label: "DNS issue", className: "bg-bg-badge-red text-bg-basic-red-strong" },
  VERCEL_CONFLICT: { label: "Connection conflict", className: "bg-bg-badge-red text-bg-basic-red-strong" },
  VERCEL_FAILED: { label: "Retrying connection", className: "bg-bg-badge-orange text-bg-basic-orange-strong" },
  VERIFICATION_TIMEOUT: { label: "Verification timed out", className: "bg-bg-badge-red text-bg-basic-red-strong" },
  ACTIVATION_FAILED: { label: "Retrying activation", className: "bg-bg-badge-orange text-bg-basic-orange-strong" },
  ACTIVATION_CONFLICT: { label: "Already in use", className: "bg-bg-badge-red text-bg-basic-red-strong" },
};

// "What to say" per the backend contract — most failures mean the domain is already the school's,
// it just isn't working yet. Only REJECTED means nothing was charged; only REJECTED and
// REGISTRATION_INDETERMINATE should ever be framed as "try again" rather than "we're on it".
export const DOMAIN_FAILURE_COPY: Partial<Record<DomainPurchaseStatus, { charged: boolean; description: string; allowRetry: boolean }>> = {
  REJECTED: { charged: false, description: "Nothing was charged. Try a different domain.", allowRetry: true },
  REGISTRATION_INDETERMINATE: {
    charged: false,
    description: "We're confirming this with the registrar. This can take a few minutes.",
    allowRetry: false,
  },
  DNS_FAILED: { charged: true, description: "This domain is yours, but DNS could not be configured. Our team has been notified.", allowRetry: false },
  VERCEL_CONFLICT: {
    charged: true,
    description: "This domain is yours, but it's already connected elsewhere. Our team has been notified.",
    allowRetry: false,
  },
  VERCEL_FAILED: { charged: true, description: "This domain is yours. Connecting it failed, but we're retrying automatically.", allowRetry: false },
  VERIFICATION_TIMEOUT: {
    charged: true,
    description: "This domain is yours, but its DNS records aren't resolving to us yet. Add the records below.",
    allowRetry: false,
  },
  ACTIVATION_FAILED: { charged: true, description: "This domain is yours. Activation failed, but we're retrying automatically.", allowRetry: false },
  ACTIVATION_CONFLICT: {
    charged: true,
    description: "This domain is already in use on the platform. Our team has been notified.",
    allowRetry: false,
  },
};
