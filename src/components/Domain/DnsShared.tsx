import { EmailSetupResult } from "@/api/domainDns";
import { Button } from "@/components/ui/button";
import { getApiErrorCode, getApiErrorDetails, getApiErrorMessage } from "@/lib/apiError";

export const COMPONENT_LABELS: Record<string, string> = {
  VERIFICATION: "Verification",
  MX: "MX",
  SPF: "SPF",
  AUTODISCOVER: "Autodiscover",
  DKIM: "DKIM",
  DMARC: "DMARC",
};

export const OUTCOME_LABELS: Record<string, string> = {
  CREATED: "Created",
  EXISTS: "Already there",
  REMOVED: "Replaced",
  REMOVE_FAILED: "Old record not removed",
};

export interface ApiErrorView {
  message: string;
  fieldErrors: string[];
  retryable: boolean;
}

export const toApiErrorView = (error: unknown): ApiErrorView => {
  const code = getApiErrorCode(error);
  const details = getApiErrorDetails(error);
  const status = error && typeof error === "object" && "status" in error ? Number((error as { status?: number }).status) : undefined;
  const fieldErrors =
    code === "VALIDATION_ERROR" && details && typeof details === "object" && !Array.isArray(details)
      ? Object.entries(details as Record<string, unknown>).map(([field, message]) => `${field}: ${String(message)}`)
      : [];
  return {
    message: getApiErrorMessage(error, "Something went wrong. Please try again."),
    fieldErrors,
    retryable: code === "DNS_CHANGE_NOT_APPLIED" || !!code?.startsWith("VERCEL_") || (status !== undefined && status >= 500) || !code,
  };
};

export const ErrorBanner = ({ error, onRetry }: { error: ApiErrorView; onRetry?: () => void }) => (
  <div className="border-bg-basic-red-strong bg-bg-badge-red flex items-start justify-between gap-3 rounded-lg border p-3">
    <div className="flex flex-col gap-1">
      <p className="text-text-default text-xs">{error.message}</p>
      {error.fieldErrors.map(f => (
        <p key={f} className="text-text-danger text-xs">
          {f}
        </p>
      ))}
    </div>
    {error.retryable && onRetry && (
      <Button variant="outline" className="border-border-default! h-7 shrink-0 px-3 text-xs" onClick={onRetry}>
        Try again
      </Button>
    )}
  </div>
);

export const ResultTable = ({ result }: { result: EmailSetupResult }) => (
  <div className="border-border-default divide-border-default divide-y overflow-hidden rounded-lg border">
    <div className="bg-bg-input-soft text-text-muted grid grid-cols-6 gap-2 px-4 py-2 text-xs font-semibold">
      <span>Purpose</span>
      <span>Host</span>
      <span>Type</span>
      <span className="col-span-2">Value</span>
      <span>Result</span>
    </div>
    {result.results.map((r, i) => (
      <div key={i} className="text-text-default grid grid-cols-6 gap-2 px-4 py-2.5 text-xs">
        <span>{COMPONENT_LABELS[r.purpose] ?? r.purpose}</span>
        <span className="font-mono">{r.name || "@"}</span>
        <span className="font-mono">{r.mxPriority !== null ? `${r.type} (${r.mxPriority})` : r.type}</span>
        <span className="col-span-2 truncate font-mono">{r.value}</span>
        <span>{OUTCOME_LABELS[r.outcome] ?? r.outcome}</span>
      </div>
    ))}
  </div>
);
