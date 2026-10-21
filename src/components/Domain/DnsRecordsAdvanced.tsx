"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { CreateDnsRecordRequest, EmailSetupResult } from "@/api/domainDns";
import { ErrorBanner, ResultTable, toApiErrorView } from "@/components/Domain/DnsShared";
import type { ApiErrorView } from "@/components/Domain/DnsShared";
import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useAddSpfInclude, useCreateDnsRecord, useDeleteDnsRecord, useDnsRecords } from "@/hooks/queryHooks/useDomainDns";
import { getApiErrorCode, getApiErrorMessage } from "@/lib/apiError";
import { canManageDomain } from "@/lib/permissions/domain";

const RECORD_TYPES = ["MX", "TXT", "CNAME", "A"] as const;

const AddRecordForm = ({ purchaseId }: { purchaseId: string }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<CreateDnsRecordRequest["type"]>("TXT");
  const [value, setValue] = useState("");
  const [mxPriority, setMxPriority] = useState("");
  const [error, setError] = useState<ApiErrorView | null>(null);
  const { mutate: createRecord, isPending } = useCreateDnsRecord();

  const priorityValid = type !== "MX" || (mxPriority.trim() !== "" && Number.isInteger(Number(mxPriority)));
  const canSubmit = value.trim() !== "" && priorityValid && !isPending;

  const submit = () => {
    setError(null);
    createRecord(
      {
        purchaseId,
        payload: { name: name.trim() || undefined, type, value: value.trim(), ...(type === "MX" && { mxPriority: Number(mxPriority) }) },
      },
      {
        onSuccess: () => {
          toast.success("Record added");
          setName("");
          setValue("");
          setMxPriority("");
        },
        onError: (err: unknown) => {
          const view = toApiErrorView(err);
          // A second SPF is refused — the SPF include form below is how to authorise another sender.
          if (getApiErrorCode(err) === "SPF_ALREADY_EXISTS" && type === "TXT") {
            setError({ ...view, message: `${view.message} To authorise another sender, use the SPF form below.` });
          } else setError(view);
        },
      },
    );
  };

  return (
    <div className="flex max-w-120 flex-col gap-2">
      <p className="text-text-default text-xs font-medium">Add a record</p>
      <div className="flex gap-2">
        <Select value={type} onValueChange={v => setType(v as CreateDnsRecordRequest["type"])}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default">
            {RECORD_TYPES.map(t => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Host (@ for root)" />
      </div>
      <Input value={value} onChange={e => setValue(e.target.value)} placeholder="Value" />
      {type === "MX" && (
        <Input value={mxPriority} onChange={e => setMxPriority(e.target.value)} placeholder="Priority (0–65535)" inputMode="numeric" />
      )}
      <PermissionCheck permissionUtility={canManageDomain}>
        <Button disabled={!canSubmit} onClick={submit} className="bg-bg-state-primary! text-text-white-default! h-8 w-fit px-4 text-xs">
          {isPending && <Spinner className="size-3" />}
          Add record
        </Button>
      </PermissionCheck>
      {error && <ErrorBanner error={error} onRetry={submit} />}
    </div>
  );
};

const SpfIncludeForm = ({ purchaseId }: { purchaseId: string }) => {
  const [include, setInclude] = useState("");
  const [result, setResult] = useState<EmailSetupResult | null>(null);
  const [error, setError] = useState<ApiErrorView | null>(null);
  const { mutate: addInclude, isPending } = useAddSpfInclude();

  const submit = () => {
    setError(null);
    addInclude(
      { purchaseId, include: include.trim() },
      {
        onSuccess: data => {
          setResult(data);
          setInclude("");
        },
        onError: (err: unknown) => setError(toApiErrorView(err)),
      },
    );
  };

  return (
    <div className="flex max-w-120 flex-col gap-2">
      <p className="text-text-default text-xs font-medium">Allow another service to send email</p>
      <Input value={include} onChange={e => setInclude(e.target.value)} placeholder="servers.mcsv.net" />
      <PermissionCheck permissionUtility={canManageDomain}>
        <Button
          disabled={!include.trim() || isPending}
          onClick={submit}
          className="bg-bg-state-primary! text-text-white-default! h-8 w-fit px-4 text-xs"
        >
          {isPending && <Spinner className="size-3" />}
          Add to SPF
        </Button>
      </PermissionCheck>
      {error && <ErrorBanner error={error} onRetry={submit} />}
      {result && <ResultTable result={result} />}
    </div>
  );
};

export const DnsRecordsAdvanced = ({ purchaseId }: { purchaseId: string }) => {
  const { data, isLoading, isError, error, refetch } = useDnsRecords(purchaseId);
  const { mutate: deleteRecord, variables, isPending: isDeleting } = useDeleteDnsRecord();

  const handleDelete = (recordId: string) => {
    deleteRecord(
      { purchaseId, recordId },
      {
        onSuccess: () => toast.success("Record deleted"),
        onError: (err: unknown) => toast.error(getApiErrorMessage(err, "Could not delete the record. Please try again.")),
      },
    );
  };

  return (
    <div className="border-border-default flex flex-col gap-5 border-t pt-4">
      {isLoading ? (
        <Skeleton className="bg-bg-input-soft h-24 w-full rounded-lg" />
      ) : isError ? (
        <ErrorBanner error={{ ...toApiErrorView(error), retryable: true }} onRetry={() => refetch()} />
      ) : (
        data && (
          <>
            <div className="border-border-default divide-border-default divide-y overflow-hidden rounded-lg border">
              <div className="bg-bg-input-soft text-text-muted grid grid-cols-6 gap-2 px-4 py-2 text-xs font-semibold">
                <span>Host</span>
                <span>Type</span>
                <span className="col-span-3">Value</span>
                <span />
              </div>
              {data.records.map(record => (
                <div key={record.id} className="text-text-default grid grid-cols-6 items-center gap-2 px-4 py-2.5 text-xs">
                  <span className="font-mono">{record.name || "@"}</span>
                  <span className="font-mono">{record.mxPriority !== null ? `${record.type} (${record.mxPriority})` : record.type}</span>
                  <span className="col-span-3 truncate font-mono">{record.value}</span>
                  <span className="flex justify-end">
                    {record.deletable ? (
                      <PermissionCheck permissionUtility={canManageDomain}>
                        <Button
                          variant="outline"
                          className="border-border-default! h-7 px-3 text-xs"
                          disabled={isDeleting && variables?.recordId === record.id}
                          onClick={() => handleDelete(record.id)}
                        >
                          Delete
                        </Button>
                      </PermissionCheck>
                    ) : (
                      <Lock className="text-text-muted size-3.5" aria-label="Locked" />
                    )}
                  </span>
                </div>
              ))}
            </div>
            <AddRecordForm purchaseId={purchaseId} />
            <SpfIncludeForm purchaseId={purchaseId} />
          </>
        )
      )}
    </div>
  );
};
