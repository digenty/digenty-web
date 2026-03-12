"use client";

import Edit from "@/components/Icons/Edit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/Toast";
import { useGetAdmissionNumberDetails, useUpdateAdmissionNumber } from "@/hooks/queryHooks/useAdmisssion";
import React, { useEffect, useState } from "react";
import { ErrorComponent } from "@/components/Error/ErrorComponent";

const DIGITS = [2, 3, 4, 5, 6, 7, 8, 9];

const buildPreview = (prefix: string, startingNumber: string, padding: string): string => {
  const seq = String(parseInt(startingNumber) || 1).padStart(Number(padding) || 2, "0");
  const year = new Date().getFullYear();
  return `${prefix || "ADM"}-${year}${seq}`.toUpperCase();
};

export const AdmissionNumberSetupDone = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [numberFormat, setNumberFormat] = useState("");
  const [startingNumber, setStartingNumber] = useState("");
  const [padding, setPadding] = useState("");

  const { data: admissionResponse, isLoading, isError } = useGetAdmissionNumberDetails();
  const { mutateAsync: updateAdmission } = useUpdateAdmissionNumber();

  const admission = admissionResponse?.data?.[0] ?? admissionResponse?.[0];

  useEffect(() => {
    if (!admission) return;
    setPrefix(admission.prefix ?? "");
    setNumberFormat(admission.numberFormat ?? "");
    setStartingNumber(String(admission.startingNumber ?? ""));
    setPadding(String(admission.padding ?? ""));
  }, [admission]);

  const preview = buildPreview(prefix, startingNumber, padding);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (admission) {
      setPrefix(admission.prefix ?? "");
      setNumberFormat(admission.numberFormat ?? "");
      setStartingNumber(String(admission.startingNumber ?? ""));
      setPadding(String(admission.padding ?? ""));
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!admission?.id) return;

    if (!prefix || !numberFormat || !startingNumber || !padding) {
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
      <div className="mx-auto flex w-full items-center justify-center md:w-151">
        <div className="flex w-full flex-col gap-6">
          <div className="mb-5 flex w-full items-start justify-between">
            <div className="text-text-default text-xl font-semibold">Admission Number</div>

            {isLoading && (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="bg-bg-input-soft h-15 w-full" />
                ))}
              </div>
            )}
            {isError && (
              <div className="flex h-80 items-center justify-center">
                <ErrorComponent
                  title="Could not get Admission Numbers"
                  description="This is our problem, we are looking into it so as to serve you better"
                  buttonText="Go to the Home page"
                />
              </div>
            )}
            {!isLoading && !isError && (
              <>
                {" "}
                {!isEditing ? (
                  <Button
                    type="button"
                    onClick={handleEdit}
                    className="bg-bg-state-secondary! border-border-darker hover:bg-bg-none! text-text-default flex h-7! items-center justify-center rounded-md border p-2"
                  >
                    <Edit fill="var(--color-icon-default-muted)" /> Edit
                  </Button>
                ) : null}
              </>
            )}
          </div>

          {!isLoading && !isError && (
            <>
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
                  <div className="bg-bg-input-soft text-text-default flex h-9 items-center rounded-md px-3 text-sm">{prefix || "—"}</div>
                )}
                <div className="text-text-muted text-xs">Common formats: ADM-, STD-, PUP-</div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">Number Format</Label>
                {isEditing ? (
                  <Input
                    value={numberFormat}
                    onChange={e => setNumberFormat(e.target.value)}
                    className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
                    placeholder="e.g. PREFIX-YEAR-SEQ"
                  />
                ) : (
                  <div className="bg-bg-input-soft text-text-default flex h-9 items-center rounded-md px-3 text-sm">{numberFormat || "—"}</div>
                )}
                <div className="text-text-muted text-xs">Use tokens: PREFIX, YEAR, MONTH, SESSION, SEQ</div>
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
                  <div className="bg-bg-input-soft text-text-default flex h-9 items-center rounded-md px-3 text-sm">{startingNumber || "—"}</div>
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
                    {padding ? `${padding} Digits` : "—"}
                  </div>
                )}
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
        <div className="border-border-default bg-bg-default sticky bottom-0 mx-auto flex w-full justify-between border-t py-3">
          <Button type="button" onClick={handleCancel} disabled={isSaving} className="bg-bg-state-soft! text-text-subtle rounded-md">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default rounded-md"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      )}
    </div>
  );
};
