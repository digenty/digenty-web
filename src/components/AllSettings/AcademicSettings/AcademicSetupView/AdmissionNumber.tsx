"use client";

import { Edit } from "@digenty/icons";
import { ErrorComponent } from "@/components/Error/ErrorComponent";

import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useGetActiveSession } from "@/hooks/queryHooks/useAcademic";
import { useGetAdmissionNumberDetails, useUpdateAdmissionNumber } from "@/hooks/queryHooks/useAdmisssion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const DIGITS = [2, 3, 4];

const buildPreview = (prefix: string, numberFormat: string, startingNumber: string, padding: string, separator: string): string => {
  const seq = String(parseInt(startingNumber) || 1).padStart(Number(padding) || 2, "0");
  const year = numberFormat;
  const sep = separator || "-";
  return [prefix || "ADM", year, seq].filter(Boolean).join(sep).toUpperCase();
};

export const AdmissionNumberSetupDone = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [numberFormat, setNumberFormat] = useState("");
  const [startingNumber, setStartingNumber] = useState("");
  const [padding, setPadding] = useState("");
  const [includeClassOfEntry, setIncludeClassOfEntry] = useState("");
  const [separator, setSeparator] = useState("");

  const { data: admissionResponse, isLoading, isError, error } = useGetAdmissionNumberDetails();
  const { mutateAsync: updateAdmission } = useUpdateAdmissionNumber();
  const { data: activeSessionResponse } = useGetActiveSession();
  const activeSessionName: string = activeSessionResponse?.data?.name ?? "";

  const admission = admissionResponse?.data ?? admissionResponse?.[0];

  useEffect(() => {
    if (!admission) return;
    setPrefix(admission.prefix ?? "");
    setNumberFormat(admission.numberFormat || activeSessionName);
    setStartingNumber(String(admission.startingNumber ?? ""));
    setPadding(String(admission.padding ?? ""));
    setIncludeClassOfEntry(admission.includeClassOfEntry !== undefined ? String(admission.includeClassOfEntry) : "");
    setSeparator(admission.separator ?? "");
  }, [admission, activeSessionName]);

  const preview = buildPreview(prefix, numberFormat, startingNumber, padding, separator);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (admission) {
      setPrefix(admission.prefix ?? "");
      setNumberFormat(admission.numberFormat || activeSessionName);
      setStartingNumber(String(admission.startingNumber ?? ""));
      setPadding(String(admission.padding ?? ""));
      setIncludeClassOfEntry(admission.includeClassOfEntry !== undefined ? String(admission.includeClassOfEntry) : "");
      setSeparator(admission.separator ?? "");
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!admission?.id) return;

    if (!prefix || !numberFormat || !startingNumber || !padding || !includeClassOfEntry || !separator) {
      toast({ title: "All fields are required", description: "Please fill in all fields before saving.", type: "warning" });
      return;
    }

    setIsSaving(true);
    try {
      await updateAdmission({
        payload: {
          prefix,
          numberFormat,
          startingNumber: parseInt(startingNumber),
          padding: parseInt(padding),
          includeClassOfEntry: includeClassOfEntry === "true",
          separator,
        },
        id: admission.id,
      });

      toast({ title: "Admission number updated", description: "Your admission number format has been saved.", type: "success" });
      setIsEditing(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";

      toast({
        title: "Failed to update",
        description: message,
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "mx-auto flex w-full items-center justify-center pb-20 md:w-151",
          !isEditing && "mx-auto flex w-full items-center justify-center md:max-w-200",
        )}
      >
        <div className="flex w-full flex-col gap-6">
          {isLoading && (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="bg-bg-input-soft h-15 w-full" />
              ))}
            </div>
          )}
          {!isLoading && isError && (
            <div className="flex h-80 w-full items-center justify-center">
              <ErrorComponent
                title="Could not get Admission Numbers"
                description={`${error.message || "This is our problem, we are looking into it so as to serve you better"}`}
                buttonText="Go to the Home page"
              />
            </div>
          )}
          {!isLoading && !isError && (
            <>
              <div className="mb-5 flex w-full items-start justify-between">
                <div className="text-text-default text-xl font-semibold">Admission Number</div>

                {!isEditing ? (
                  <Button
                    type="button"
                    onClick={handleEdit}
                    className="bg-bg-state-secondary! border-border-darker hover:bg-bg-none! text-text-default flex h-7! items-center justify-center rounded-md border p-2"
                  >
                    <Edit fill="var(--color-icon-default-muted)" /> Edit
                  </Button>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">Admission Number Prefix</Label>
                {isEditing ? (
                  <Input
                    value={prefix}
                    onChange={e => setPrefix(e.target.value)}
                    className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
                    placeholder="e.g. ADM-"
                  />
                ) : (
                  <div className="bg-bg-input-soft text-text-default flex h-9 items-center rounded-md px-3 text-sm">
                    {admissionResponse?.data?.prefix || "-—"}
                  </div>
                )}
                <div className="text-text-muted text-xs">Common formats: ADM-, STD-, PUP-</div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">Number Format</Label>
                {isEditing ? (
                  <Select value={numberFormat} onValueChange={setNumberFormat}>
                    <SelectTrigger className="bg-bg-input-soft! h-9! w-full rounded-md border-none">
                      <SelectValue placeholder="Select academic year">
                        <span className="text-text-default text-sm">{numberFormat || "Select academic year"}</span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-bg-card border-border-default">
                      {activeSessionName && (
                        <SelectItem value={activeSessionName} className="text-text-default text-sm font-medium">
                          {activeSessionName}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="bg-bg-input-soft text-text-default flex h-9 items-center rounded-md px-3 text-sm">
                    {admissionResponse?.data?.numberFormat || "-—"}
                  </div>
                )}
                <div className="text-text-muted text-xs">The current academic year to include in the admission number</div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">Starting Number</Label>
                {isEditing ? (
                  <Input
                    value={startingNumber}
                    onChange={e => setStartingNumber(e.target.value)}
                    type="number"
                    className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
                    placeholder="1"
                  />
                ) : (
                  <div className="bg-bg-input-soft text-text-default flex h-9 items-center rounded-md px-3 text-sm">
                    {admissionResponse?.data?.startingNumber || "-—"}
                  </div>
                )}
                <div className="text-text-muted text-xs">The first admission number to use</div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">Padding</Label>
                {isEditing ? (
                  <Select value={padding} onValueChange={setPadding}>
                    <SelectTrigger className="bg-bg-input-soft! h-9! w-full rounded-md border-none">
                      <SelectValue>
                        <span className="text-text-default text-sm">{padding ? `${padding} Digits` : "Select padding"}</span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-bg-card border-border-default">
                      {DIGITS.map(dgt => (
                        <SelectItem key={dgt} value={String(dgt)} className="text-text-default text-sm font-medium">
                          {dgt} Digits
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="bg-bg-input-soft text-text-default flex h-9 items-center rounded-md px-3 text-sm">
                    {admissionResponse?.data?.padding ? `${admissionResponse?.data?.padding} Digits` : "-—"}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">Separator</Label>
                {isEditing ? (
                  <Input
                    value={separator}
                    onChange={e => setSeparator(e.target.value)}
                    className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
                    placeholder="e.g. - or /"
                  />
                ) : (
                  <div className="bg-bg-input-soft text-text-default flex h-9 items-center rounded-md px-3 text-sm">
                    {admissionResponse?.data?.separator || "-—"}
                  </div>
                )}
                <div className="text-text-muted text-xs">Character used between parts of the admission number, e.g. - or /</div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">Include Class of Entry</Label>
                {isEditing ? (
                  <Select value={includeClassOfEntry} onValueChange={setIncludeClassOfEntry}>
                    <SelectTrigger className="bg-bg-input-soft! h-9! w-full rounded-md border-none">
                      <SelectValue placeholder="Select option">
                        <span className="text-text-default text-sm">
                          {includeClassOfEntry ? (includeClassOfEntry === "true" ? "Yes" : "No") : "Select option"}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-bg-card border-border-default">
                      <SelectItem value="true" className="text-text-default text-sm font-medium">
                        Yes
                      </SelectItem>
                      <SelectItem value="false" className="text-text-default text-sm font-medium">
                        No
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="bg-bg-input-soft text-text-default flex h-9 items-center rounded-md px-3 text-sm">
                    {admissionResponse?.data?.includeClassOfEntry !== undefined
                      ? admissionResponse?.data?.includeClassOfEntry
                        ? "Yes"
                        : "No"
                      : "-—"}
                  </div>
                )}
                <div className="text-text-muted text-xs">Whether the student&apos;s class of entry appears in the admission number</div>
              </div>

              {isEditing && (
                <div className="border-border-default bg-bg-basic-blue-subtle flex w-full items-center gap-2 rounded-md border px-3 py-2.5">
                  <div className="bg-bg-basic-blue-accent border-border-default h-6 w-1 border-2" />
                  <div className="text-text-subtle text-sm">Next Admission Number: {preview}</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="border-border-default bg-bg-default fixed right-0 bottom-0 left-0 z-10 flex justify-between border-t px-4 py-3 md:left-(--sidebar-w) md:px-36">
          <Button type="button" onClick={handleCancel} disabled={isSaving} className="bg-bg-state-soft! text-text-subtle h-7! rounded-md">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-7! rounded-md"
          >
            {isSaving && <Spinner className="text-text-white-default" />}
            Save changes
          </Button>
        </div>
      )}
    </div>
  );
};
