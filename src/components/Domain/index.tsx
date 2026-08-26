"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Globe } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useDomainPurchase, useDomainPurchases, usePurchaseAndConnectDomain } from "@/hooks/queryHooks/useDomain";
import { DomainPurchaseDto, DomainPurchaseType } from "@/api/domain";
import { DOMAIN_FAILURE_COPY, DOMAIN_STATUS_CONFIG, isDomainPurchaseFailed, isDomainPurchaseInFlight, isDomainPurchaseLive } from "@/queries/domain";
import { getApiErrorCode, getApiErrorDetails, getApiErrorMessage } from "@/lib/apiError";
import { cn } from "@/lib/utils";

const DOMAIN_REGEX = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;

const SCHOOL_PROFILE_FIELD_LABELS: Record<string, string> = {
  "school.address": "school address",
  "school.phoneNumber": "school phone number",
  "school.name": "school name",
  "school.email": "school email",
};

const DnsRecordsTable = ({ records }: { records: DomainPurchaseDto["requiredDnsRecords"] }) => (
  <div className="border-border-default divide-border-default divide-y overflow-hidden rounded-lg border">
    <div className="bg-bg-input-soft text-text-muted grid grid-cols-4 gap-2 px-4 py-2 text-xs font-semibold">
      <span>Host</span>
      <span>Type</span>
      <span className="col-span-2">Value</span>
    </div>
    {records.map((record, i) => (
      <div key={i} className="text-text-default grid grid-cols-4 gap-2 px-4 py-2.5 text-xs">
        <span className="font-mono">{record.hostname}</span>
        <span className="font-mono">{record.type}</span>
        <span className="col-span-2 truncate font-mono">{record.value}</span>
      </div>
    ))}
  </div>
);

const DomainProgressCard = ({ purchase, onStartOver }: { purchase: DomainPurchaseDto; onStartOver: () => void }) => {
  const { data } = useDomainPurchase(purchase.purchaseId);
  const current = data ?? purchase;
  const statusConfig = DOMAIN_STATUS_CONFIG[current.status];
  const failure = DOMAIN_FAILURE_COPY[current.status];
  const inFlight = isDomainPurchaseInFlight(current.status);
  const live = isDomainPurchaseLive(current.status);
  const failed = isDomainPurchaseFailed(current.status);

  const showDnsRecords = current.requiredDnsRecords.length > 0 && (!current.manageDns || current.status === "VERIFICATION_TIMEOUT");

  return (
    <div className="flex flex-col gap-4">
      <div
        className={cn(
          "flex items-start justify-between gap-3 rounded-lg border p-4",
          live
            ? "border-bg-basic-green-strong bg-bg-badge-green"
            : failed
              ? "border-bg-basic-red-strong bg-bg-badge-red"
              : "border-border-default bg-bg-badge-blue",
        )}
      >
        <div className="flex items-start gap-3">
          {live ? (
            <CheckCircle2 className="text-bg-basic-green-strong mt-0.5 size-5 shrink-0" />
          ) : failed ? (
            <AlertTriangle className="text-bg-basic-red-strong mt-0.5 size-5 shrink-0" />
          ) : (
            <Spinner className="mt-0.5 size-5 shrink-0" />
          )}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="text-text-default text-sm font-medium">{current.domainName}</p>
              <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", statusConfig.className)}>{statusConfig.label}</span>
              {current.simulated && (
                <span className="bg-bg-badge-orange text-bg-basic-orange-strong rounded-full px-2.5 py-1 text-xs font-medium">Simulated</span>
              )}
            </div>
            <p className="text-text-muted text-xs">{current.message}</p>
            {current.requiresManualReview && <p className="text-text-muted text-xs">Our team has been notified and is on this.</p>}
            {failure && <p className="text-text-muted text-xs">{failure.description}</p>}
          </div>
        </div>

        {(live || failure?.allowRetry) && (
          <Button variant="outline" className="border-border-default! h-8 shrink-0 px-4 text-xs" onClick={onStartOver}>
            {live ? "Change domain" : "Try a different domain"}
          </Button>
        )}
      </div>

      {showDnsRecords && (
        <div className="flex flex-col gap-2">
          <p className="text-text-default text-sm font-medium">Add these DNS records</p>
          <p className="text-text-muted text-xs">Provisioning can&apos;t finish until these are in place with your DNS provider.</p>
          <DnsRecordsTable records={current.requiredDnsRecords} />
        </div>
      )}

      {inFlight && <p className="text-text-hint text-xs">This can take a few minutes, occasionally longer — this page updates on its own.</p>}
    </div>
  );
};

const DomainConnectForm = ({ onPurchased }: { onPurchased: (purchase: DomainPurchaseDto) => void }) => {
  const [mode, setMode] = useState<DomainPurchaseType>("PURCHASE");
  const [domainName, setDomainName] = useState("");
  const { mutate: purchaseAndConnect, isPending } = usePurchaseAndConnectDomain();

  const trimmed = domainName.trim().toLowerCase();
  const isValid = DOMAIN_REGEX.test(trimmed);

  const handleSubmit = () => {
    if (!isValid) return;

    purchaseAndConnect(
      { domainName: trimmed, purchaseType: mode, years: mode === "PURCHASE" ? 1 : undefined },
      {
        onSuccess: purchase => {
          toast.success(mode === "PURCHASE" ? "Domain purchase started" : "Domain connection started");
          onPurchased(purchase);
        },
        onError: (error: unknown) => {
          const code = getApiErrorCode(error);
          const details = getApiErrorDetails(error);
          if (code === "DUPLICATE_RECORD_REQUEST") {
            toast.error("That domain is already taken.");
          } else if (code === "SUBSCRIPTION_REQUIRED") {
            toast.error("Your current plan doesn't include custom domains.");
          } else if (Array.isArray(details) && details.length > 0) {
            const missing = details
              .map(field => (typeof field === "string" ? (SCHOOL_PROFILE_FIELD_LABELS[field] ?? field.split(".").pop()) : String(field)))
              .join(", ");
            toast.error(getApiErrorMessage(error, "Complete your school profile before buying a domain."), {
              description: `Missing: ${missing}`,
            });
          } else {
            toast.error(getApiErrorMessage(error, "Could not connect that domain. Please try again."));
          }
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-bg-input-soft flex gap-1 rounded-lg p-1">
        {(
          [
            { value: "PURCHASE" as const, label: "Buy a new domain" },
            { value: "CONNECT_EXISTING" as const, label: "Connect a domain I own" },
          ] satisfies { value: DomainPurchaseType; label: string }[]
        ).map(tab => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setMode(tab.value)}
            className={cn(
              "flex-1 cursor-pointer rounded-md py-2 text-sm font-medium transition-colors",
              mode === tab.value ? "bg-bg-card text-text-default shadow-xs" : "text-text-muted",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="border-bg-basic-lime-accent bg-bg-basic-lime-subtle flex flex-col items-center justify-center gap-3 rounded-xl border px-6 py-10">
        <p className="text-text-subtle text-xs">Every great idea starts with a name!</p>
        <p className="text-text-default text-base font-semibold">{mode === "PURCHASE" ? "Search up a domain" : "Enter the domain you already own"}</p>
        <div className="flex w-full max-w-100 flex-col gap-2">
          <Input
            value={domainName}
            onChange={e => setDomainName(e.target.value)}
            placeholder={mode === "PURCHASE" ? "e.g. yourschool.com" : "e.g. www.yourschool.com"}
          />
          {domainName.trim().length > 0 && !isValid && <p className="text-text-danger text-xs">Enter a valid domain, e.g. yourschool.com</p>}
          {mode === "PURCHASE" && (
            <p className="text-text-muted text-xs">Root domains only (yourschool.com). Use &ldquo;connect existing&rdquo; for a subdomain.</p>
          )}
          <Button
            disabled={!isValid || isPending}
            onClick={handleSubmit}
            className="bg-bg-state-primary! text-text-white-default! hover:bg-bg-state-primary-hover! mt-1 h-9"
          >
            {isPending && <Spinner className="size-3" />}
            {mode === "PURCHASE" ? "Buy & connect" : "Connect domain"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const DomainMain = () => {
  const { data: purchases, isLoading } = useDomainPurchases();
  const [startedOver, setStartedOver] = useState(false);
  const [justPurchased, setJustPurchased] = useState<DomainPurchaseDto | null>(null);

  useBreadcrumb([{ label: "Domain", url: "/staff/domain" }]);

  const activePurchase = justPurchased ?? purchases?.[0];
  const showForm = startedOver || !activePurchase;

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center gap-3">
        <Globe className="text-text-muted size-5" />
        <h2 className="text-text-default text-xl font-semibold">Domain</h2>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="bg-bg-input-soft h-16 w-full rounded-lg" />
          <Skeleton className="bg-bg-input-soft h-40 w-full rounded-xl" />
        </div>
      ) : showForm ? (
        <DomainConnectForm
          onPurchased={purchase => {
            setJustPurchased(purchase);
            setStartedOver(false);
          }}
        />
      ) : (
        <DomainProgressCard
          purchase={activePurchase}
          onStartOver={() => {
            setJustPurchased(null);
            setStartedOver(true);
          }}
        />
      )}
    </div>
  );
};
