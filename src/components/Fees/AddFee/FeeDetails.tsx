"use client";

import { Toggle } from "@/components/Toggle";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormikContext } from "formik";
import type { FeeItemFormValues } from "./useFeeForm";
import { useFeeFormData } from "./useFeeForm";
import type { FeeTermType } from "@/api/fee";

const FeeDetails = () => {
  const { values, errors, touched, setFieldValue, handleChange, handleBlur } = useFormikContext<FeeItemFormValues>();
  const { termList, sessionName, sessionId } = useFeeFormData();
  console.log(sessionId, sessionName);
  const decrease = () => setFieldValue("quantity", values.quantity > 1 ? values.quantity - 1 : 1);
  const increase = () => setFieldValue("quantity", values.quantity + 1);

  return (
    <div className="border-border-default flex flex-col gap-6 rounded-md border p-4 md:rounded-none md:border-b md:pb-6">
      <div className="text-text-default text-lg font-semibold">Fee Details</div>

      <div className="flex flex-col gap-2">
        <Label className="text-text-default text-sm font-medium">Fee Name</Label>
        <Input
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className="bg-bg-input-soft! text-text-default rounded-md border-none"
          placeholder="Input Fee Name"
        />
        {touched.name && errors.name && <span className="text-text-destructive text-xs">{errors.name}</span>}
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
          <Select value={sessionId ? String(sessionId) : ""} onValueChange={value => setFieldValue("sessionId", Number(value))}>
            <Label className="text-text-default mb-2 text-sm font-medium">Session</Label>
            <SelectTrigger className="bg-bg-input-soft! h-8! w-full rounded-md border-none">
              <SelectValue placeholder="Select session">
                <span className="text-text-muted text-sm font-normal">{sessionName || "Select session"}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default">
              {sessionId && (
                <SelectItem value={String(sessionId)} className="text-text-default text-sm font-normal">
                  {sessionName || `Session ${sessionId}`}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {touched.sessionId && errors.sessionId && <span className="text-text-destructive text-xs">{errors.sessionId}</span>}
        </div>

        <div className="w-full">
          <Select value={values.term} onValueChange={value => setFieldValue("term", value as FeeTermType)}>
            <Label className="text-text-default mb-2 text-sm font-medium">Term</Label>
            <SelectTrigger className="bg-bg-input-soft! h-8! w-full rounded-md border-none">
              <SelectValue placeholder="Select term">
                <span className="text-text-muted text-sm font-normal capitalize">{values.term ? values.term.toLowerCase() : "Select term"}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default">
              {termList.map(t => (
                <SelectItem key={t.termId} value={t.term} className="text-text-default text-sm font-normal capitalize">
                  {t.term.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {touched.term && errors.term && <span className="text-text-destructive text-xs">{errors.term}</span>}
        </div>
      </div>

      <div>
        <Label className="text-text-default mb-2 text-sm font-medium">Quantity</Label>
        <div className="bg-bg-input-soft flex w-full max-w-57 justify-between gap-2 rounded-md p-2">
          <div className="text-text-subtle cursor-pointer select-none" onClick={decrease}>
            -
          </div>
          <div className="text-text-default text-sm font-normal">{values.quantity}</div>
          <div className="text-text-subtle cursor-pointer select-none" onClick={increase}>
            +
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeDetails;
