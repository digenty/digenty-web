"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { DmarcPolicy, EmailProvider, EmailSetupRequest, EmailSetupResult, EmailSetupStatus, ZohoRegion } from "@/api/domainDns";
import { DnsRecordsAdvanced } from "@/components/Domain/DnsRecordsAdvanced";
import { COMPONENT_LABELS, ErrorBanner, ResultTable, toApiErrorView } from "@/components/Domain/DnsShared";
import type { ApiErrorView } from "@/components/Domain/DnsShared";
import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useEmailSetup, useEmailSetupStatus } from "@/hooks/queryHooks/useDomainDns";
import { getApiErrorCode } from "@/lib/apiError";
import { canManageDomain } from "@/lib/permissions/domain";
import { cn } from "@/lib/utils";

const PROVIDERS: { value: EmailProvider; label: string }[] = [
  { value: "ZOHO", label: "Zoho Mail" },
  { value: "GOOGLE", label: "Google Workspace" },
  { value: "MICROSOFT", label: "Microsoft 365" },
];

// Region is the domain the admin signs in to Zoho at. Getting it wrong means mail never arrives.
const ZOHO_REGIONS: { value: ZohoRegion; label: string }[] = [
  { value: "COM", label: "mail.zoho.com" },
  { value: "EU", label: "mail.zoho.eu" },
  { value: "IN", label: "mail.zoho.in" },
  { value: "AU", label: "mail.zoho.com.au" },
  { value: "JP", label: "mail.zoho.jp" },
  { value: "CA", label: "mail.zohocloud.ca" },
  { value: "SA", label: "mail.zoho.sa" },
];

// Order matters: zoho.com.au must be tested before zoho.com.
const REGION_BY_MX_SUFFIX: [string, ZohoRegion][] = [
  ["zoho.com.au", "AU"],
  ["zoho.com", "COM"],
  ["zoho.eu", "EU"],
  ["zoho.in", "IN"],
  ["zoho.jp", "JP"],
  ["zohocloud.ca", "CA"],
  ["zoho.sa", "SA"],
];

const regionFromStatus = (status?: EmailSetupStatus): ZohoRegion | "" => {
  const mx = status?.components
    .find(c => c.component === "MX")
    ?.records[0]?.value?.toLowerCase()
    .replace(/\.$/, "");
  if (!mx) return "";
  return REGION_BY_MX_SUFFIX.find(([suffix]) => mx.endsWith(`.${suffix}`) || mx === suffix)?.[1] ?? "";
};

const STATE_CONFIG = {
  NOT_CONFIGURED: { label: "Not configured", className: "bg-bg-input-soft text-text-muted" },
  PROPAGATING: { label: "Propagating", className: "bg-bg-badge-orange text-bg-basic-orange-strong" },
  ACTIVE: { label: "Active", className: "bg-bg-badge-green text-bg-basic-green-strong" },
} as const;

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <label className="text-text-default text-xs font-medium">{label}</label>
    {children}
  </div>
);

const StatusPanel = ({ status }: { status: EmailSetupStatus }) => (
  <div className="flex flex-col gap-3">
    <div className="border-border-default divide-border-default divide-y overflow-hidden rounded-lg border">
      {status.components.map(c => (
        <div key={c.component} className="flex items-center justify-between px-4 py-2.5">
          <span className="text-text-default text-xs font-medium">{COMPONENT_LABELS[c.component] ?? c.component}</span>
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", STATE_CONFIG[c.state].className)}>{STATE_CONFIG[c.state].label}</span>
        </div>
      ))}
    </div>
    {status.nextSteps.length > 0 && (
      <ol className="text-text-muted flex list-decimal flex-col gap-1 pl-5 text-xs">
        {status.nextSteps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    )}
  </div>
);

const EmailSetupForm = ({ purchaseId, domain, status }: { purchaseId: string; domain: string; status?: EmailSetupStatus }) => {
  const initialProvider = status?.provider && status.provider !== "OTHER" ? status.provider : "";
  const [provider, setProvider] = useState<EmailProvider | "">(initialProvider);
  const [region, setRegion] = useState<ZohoRegion | "">(regionFromStatus(status));
  const [verification, setVerification] = useState("");
  const [dkimSelector, setDkimSelector] = useState("");
  const [dkimValue, setDkimValue] = useState("");
  const [mxHost, setMxHost] = useState("");
  const [msSelector1, setMsSelector1] = useState("");
  const [msSelector2, setMsSelector2] = useState("");
  const [dmarcPolicy, setDmarcPolicy] = useState<DmarcPolicy | "">("");
  const [dmarcEmail, setDmarcEmail] = useState("");

  const [result, setResult] = useState<EmailSetupResult | null>(null);
  const [error, setError] = useState<ApiErrorView | null>(null);
  const [pendingSwitch, setPendingSwitch] = useState<EmailSetupRequest | null>(null);
  const { mutate: setup, isPending } = useEmailSetup();

  const isMicrosoft = provider === "MICROSOFT";
  const isZoho = provider === "ZOHO";

  const buildRequest = (): EmailSetupRequest | null => {
    if (!provider) return null;
    const request: EmailSetupRequest = { provider };
    if (isZoho && region) request.region = region;
    if (verification.trim()) request.verification = { value: verification.trim() };
    if (isMicrosoft) {
      if (mxHost.trim()) request.mxHost = mxHost.trim();
      if (msSelector1.trim() || msSelector2.trim()) request.microsoftDkim = { selector1: msSelector1.trim(), selector2: msSelector2.trim() };
    } else if (dkimSelector.trim() || dkimValue.trim()) {
      request.dkim = { selector: dkimSelector.trim(), value: dkimValue };
    }
    if (dmarcPolicy || dmarcEmail.trim()) {
      request.dmarc = { ...(dmarcPolicy && { policy: dmarcPolicy }), ...(dmarcEmail.trim() && { reportEmail: dmarcEmail.trim() }) };
    }
    return request;
  };

  const request = buildRequest();
  const canSubmit = !!request && !isPending && (!isZoho || !!region) && Object.keys(request).some(k => !["provider", "region"].includes(k));

  const submit = (payload: EmailSetupRequest) => {
    setError(null);
    setup(
      { purchaseId, payload },
      {
        onSuccess: data => {
          setResult(data);
          setPendingSwitch(null);
        },
        onError: (err: unknown) => {
          const view = toApiErrorView(err);
          // If the message mentions support, the old records were added by support — nothing the school can confirm.
          if (getApiErrorCode(err) === "MX_CONFLICT" && !/support/i.test(view.message)) {
            setPendingSwitch(payload);
            return;
          }
          setPendingSwitch(null);
          setError(view);
        },
      },
    );
  };

  const providerLabel = PROVIDERS.find(p => p.value === provider)?.label ?? "the new provider";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex max-w-120 flex-col gap-3">
        <Field label="Email provider">
          <Select value={provider} onValueChange={v => setProvider(v as EmailProvider)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a provider" />
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default">
              {PROVIDERS.map(p => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {isZoho && (
          <Field label="Zoho region (the address you sign in at)">
            <Select value={region} onValueChange={v => setRegion(v as ZohoRegion)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose your region" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                {ZOHO_REGIONS.map(r => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}

        {provider && (
          <>
            <Field label="Verification value from your provider">
              <Input
                value={verification}
                onChange={e => setVerification(e.target.value)}
                placeholder={isMicrosoft ? "MS=ms12345678" : isZoho ? "zoho-verification=zb12345678.zmverify.zoho.com" : "google-site-verification=…"}
              />
            </Field>

            {isMicrosoft ? (
              <>
                <Field label="Mail server (MX) from Microsoft 365, shown after you verify">
                  <Input value={mxHost} onChange={e => setMxHost(e.target.value)} placeholder="school-com-ng.mail.protection.outlook.com" />
                </Field>
                <Field label="DKIM selector 1 (CNAME value from the Defender portal)">
                  <Input value={msSelector1} onChange={e => setMsSelector1(e.target.value)} />
                </Field>
                <Field label="DKIM selector 2 (CNAME value from the Defender portal)">
                  <Input value={msSelector2} onChange={e => setMsSelector2(e.target.value)} />
                </Field>
              </>
            ) : (
              <>
                <Field label="DKIM selector (shown after you verify)">
                  <Input value={dkimSelector} onChange={e => setDkimSelector(e.target.value)} placeholder="zmail" />
                </Field>
                <Field label="DKIM value">
                  <Textarea value={dkimValue} onChange={e => setDkimValue(e.target.value)} placeholder="v=DKIM1; k=rsa; p=…" />
                </Field>
              </>
            )}

            <Field label="DMARC policy (optional)">
              <Select value={dmarcPolicy} onValueChange={v => setDmarcPolicy(v as DmarcPolicy)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="none" />
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-border-default">
                  {(["none", "quarantine", "reject"] as const).map(p => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="DMARC report email (optional)">
              <Input value={dmarcEmail} onChange={e => setDmarcEmail(e.target.value)} placeholder={`it@${domain}`} />
            </Field>

            <PermissionCheck permissionUtility={canManageDomain}>
              <Button
                disabled={!canSubmit}
                onClick={() => request && submit(request)}
                className="bg-bg-state-primary! text-text-white-default! hover:bg-bg-state-primary-hover! h-9 w-fit px-6"
              >
                {isPending && <Spinner className="size-3" />}
                Save email setup
              </Button>
            </PermissionCheck>
          </>
        )}
      </div>

      {error && <ErrorBanner error={error} onRetry={request ? () => submit(request) : undefined} />}
      {result && <ResultTable result={result} />}

      <Dialog open={!!pendingSwitch} onOpenChange={open => !open && setPendingSwitch(null)}>
        <DialogContent className="bg-bg-card border-border-default max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-text-default text-md font-semibold">Switch email provider?</DialogTitle>
            <DialogDescription className="text-text-muted text-sm">
              {domain} already receives email somewhere else. If you continue, mail will only be delivered to {providerLabel}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="border-border-default!" onClick={() => setPendingSwitch(null)}>
              Cancel
            </Button>
            <Button
              disabled={isPending}
              className="bg-bg-state-primary! text-text-white-default!"
              onClick={() => pendingSwitch && submit({ ...pendingSwitch, replaceExistingMx: true })}
            >
              {isPending && <Spinner className="size-3" />}
              Switch to {providerLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const EmailSetupSection = ({ purchaseId, domain }: { purchaseId: string; domain: string }) => {
  const { data: status, isLoading, isError, error, refetch } = useEmailSetupStatus(purchaseId);
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="border-border-default flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        {status?.complete ? <CheckCircle2 className="text-bg-basic-green-strong size-5" /> : <AlertTriangle className="text-text-muted size-5" />}
        <p className="text-text-default text-sm font-medium">Email for {domain}</p>
      </div>

      {isLoading ? (
        <Skeleton className="bg-bg-input-soft h-32 w-full rounded-lg" />
      ) : (
        <>
          {isError ? (
            <ErrorBanner error={{ ...toApiErrorView(error), retryable: true }} onRetry={() => refetch()} />
          ) : (
            status && <StatusPanel status={status} />
          )}
          {/* Mounted only after the status has loaded, so provider/region seed from it and a returning admin resumes where they left off. */}
          <EmailSetupForm purchaseId={purchaseId} domain={domain} status={status} />
        </>
      )}

      <Button variant="outline" className="border-border-default! h-8 w-fit px-4 text-xs" onClick={() => setShowAdvanced(v => !v)}>
        {showAdvanced ? "Hide advanced" : "Advanced"}
      </Button>
      {showAdvanced && <DnsRecordsAdvanced purchaseId={purchaseId} />}
    </div>
  );
};
