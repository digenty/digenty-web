"use client";

import React from "react";
import { Toggle } from "@/components/Toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StockSheet } from "@/components/Invoices/NewInvoice/NewInvoiceItems/StockSheet";
import { FormikProps } from "formik";
import { FeeFormValues } from "@/api/types";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useGetActiveSession } from "@/hooks/queryHooks/useAcademic";
import { FeeTermType } from "@/api/fee";
import { cn, unwrapArray, extractSessionId } from "@/lib/utils";

const TERM_MAP: Record<FeeTermType, string> = {
  FIRST: "First Term",
  SECOND: "Second Term",
  THIRD: "Third Term",
};

interface TermEntry {
  id: number;
  sessionId: number;
  term: FeeTermType;
  label: string;
}

interface Props {
  formik: FormikProps<FeeFormValues>;
}

const FeeDetails = ({ formik }: Props) => {
  const { schoolId } = useLoggedInUser();
  const { data: termsData } = useGetTerms(schoolId);
  const { data: activeSessionData } = useGetActiveSession();

  const sessionId = extractSessionId(activeSessionData) ?? 0;

  const activeSessionName: string =
    (activeSessionData as { data?: { academicSessionName?: string; name?: string } })?.data?.academicSessionName ??
    (activeSessionData as { data?: { name?: string } })?.data?.name ??
    (activeSessionData as { name?: string })?.name ??
    "";

  const rawTerms: TermEntry[] = unwrapArray<{ termId: number; term: FeeTermType }>(termsData).map(t => ({
    id: t.termId,
    sessionId,
    term: t.term,
    label: TERM_MAP[t.term] ?? t.term,
  }));

  React.useEffect(() => {
    if (sessionId && formik.values.session !== sessionId) {
      formik.setFieldValue("session", sessionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const selectedTermEntry = rawTerms.find(t => t.sessionId === formik.values.session && t.term === formik.values.term);

  const handleTermChange = (label: string) => {
    const entry = rawTerms.find(t => t.label === label);
    if (entry) {
      formik.setFieldValue("session", entry.sessionId);
      formik.setFieldValue("term", entry.term);
    }
  };

  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik;

  return (
    <div className="border-border-default flex flex-col gap-6 rounded-md border p-4 md:rounded-none md:border-b md:pb-6">
      <div className="w-41">
        <StockSheet />
      </div>

      <div className="text-text-default text-lg font-semibold">Fee Details</div>

      {/* Fee Name */}
      <div className="flex flex-col gap-2">
        <Label className="text-text-default text-sm font-medium">Fee Name</Label>
        <Input
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn("bg-bg-input-soft! text-text-muted rounded-md border-none", errors.name && touched.name && "border border-red-500")}
          placeholder="Input Fee Name"
        />
        {touched.name && errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
      </div>

      <div className="flex max-w-fit items-center gap-2">
        {values.required ? (
          <Badge className="text-bg-basic-fuchsia-strong bg-bg-badge-fuchsia border-border-default h-5! w-16! rounded-sm border">Required</Badge>
        ) : (
          <Badge className="text-text-default border-border-default h-5! w-16! rounded-sm border">Optional</Badge>
        )}
        <Toggle checked={values.required} onChange={e => setFieldValue("required", e.target.checked)} className="border-none" />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <div className="w-full">
          <Label className="text-text-default mb-2 text-sm font-medium">Session</Label>
          <Select
            value={activeSessionName}
            onValueChange={() => {
              /* read-only — only one active session */
            }}
          >
            <SelectTrigger className="bg-bg-input-soft! h-8! w-full rounded-md border-none">
              <SelectValue placeholder="Active session">
                <span className="text-text-muted text-sm font-normal">{activeSessionName || "Loading..."}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default">
              {activeSessionName && (
                <SelectItem value={activeSessionName} className="text-text-default text-sm font-normal">
                  {activeSessionName}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Term */}
        <div className="w-full">
          <Label className="text-text-default mb-2 text-sm font-medium">Term</Label>
          <Select value={selectedTermEntry?.label ?? ""} onValueChange={handleTermChange}>
            <SelectTrigger
              className={cn("bg-bg-input-soft! h-8! w-full rounded-md border-none", errors.term && touched.term && "border border-red-500")}
            >
              <SelectValue placeholder="Select term">
                <span className="text-text-muted text-sm font-normal">{selectedTermEntry?.label ?? "Select term"}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default">
              {rawTerms.map(t => (
                <SelectItem key={`${t.sessionId}-${t.term}`} value={t.label} className="text-text-default text-sm font-normal">
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {touched.term && errors.term && <p className="text-xs text-red-500">{String(errors.term)}</p>}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <Label className="text-text-default mb-2 text-sm font-medium">Quantity</Label>
        <div className="bg-bg-input-soft flex w-full max-w-57 justify-between gap-2 rounded-md p-2">
          <button
            type="button"
            className="text-text-subtle cursor-pointer"
            onClick={() => setFieldValue("quantity", Math.max(1, values.quantity - 1))}
          >
            -
          </button>
          <div className="text-text-default text-sm font-normal">{values.quantity}</div>
          <button type="button" className="text-text-subtle cursor-pointer" onClick={() => setFieldValue("quantity", values.quantity + 1)}>
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeeDetails;
