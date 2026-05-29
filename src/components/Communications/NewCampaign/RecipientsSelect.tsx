"use client";

import { Group } from "@digenty/icons";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Badge } from "../../ui/badge";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";

import { recipientOptions } from "../mockData";

type RecipientsSelectProps = {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  summary: string;
};

export const RecipientsSelect = ({ value, onChange, error, summary }: RecipientsSelectProps) => {
  const [open, setOpen] = useState(false);

  const toggleOption = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter(v => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeOption = (val: string) => onChange(value.filter(v => v !== val));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Label className="text-text-default text-sm font-medium">Send to</Label>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className={cn(
            "bg-bg-input-soft text-text-default border-border-default flex h-9 w-full items-center justify-between rounded-md border px-3 text-sm",
            value.length === 0 && "text-text-muted",
          )}
        >
          <span className="flex items-center gap-2">
            <Group fill="var(--color-icon-default-muted)" className="size-4" />
            {value.length === 0 ? "Select recipients" : `${value.length} group${value.length > 1 ? "s" : ""} selected`}
          </span>
          {open ? <ChevronUp className="text-icon-default-muted size-4" /> : <ChevronDown className="text-icon-default-muted size-4" />}
        </button>

        {open && (
          <div className="bg-bg-card border-border-default flex max-h-64 flex-col gap-1 overflow-y-auto rounded-md border p-2 shadow-sm">
            {recipientOptions.map(opt => {
              const selected = value.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="hover:bg-bg-state-ghost-hover flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm"
                >
                  <Checkbox checked={selected} onCheckedChange={() => toggleOption(opt.value)} />
                  <span className="text-text-default">{opt.label}</span>
                </label>
              );
            })}
          </div>
        )}

        {value.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {value.map(val => {
              const opt = recipientOptions.find(o => o.value === val);
              if (!opt) return null;
              return (
                <Badge
                  key={val}
                  className="bg-bg-badge-default text-text-default border-border-default flex items-center gap-1 rounded-md border text-xs"
                >
                  {opt.label}
                  <button type="button" onClick={() => removeOption(val)} aria-label={`Remove ${opt.label}`}>
                    <X className="text-icon-default-muted size-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}

        {error && <p className="text-text-destructive text-xs">{error}</p>}
      </div>

      <div className="border-border-default bg-bg-card-subtle flex items-center justify-between rounded-md border px-4 py-3">
        <div className="flex flex-col">
          <span className="text-text-default text-sm font-semibold">Selected Recipients</span>
          <span className="text-text-muted text-xs">{summary}</span>
        </div>
        <Badge className="bg-bg-state-strong text-text-white-default flex h-6 min-w-6 items-center justify-center rounded-md text-xs font-medium">
          {value.length}
        </Badge>
      </div>
    </div>
  );
};
