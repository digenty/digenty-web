"use client";

import { Group } from "@digenty/icons";
import { ChevronDown, User, X } from "lucide-react";
import { useState } from "react";

import { Label } from "../../ui/label";

import { SelectedRecipient } from "../types";
import { SelectRecipientsModal } from "./SelectRecipientsModal";

type RecipientsSelectProps = {
  value: SelectedRecipient[];
  onChange: (value: SelectedRecipient[]) => void;
  error?: string;
  summary?: string;
};

export const RecipientsSelect = ({ value, onChange, error }: RecipientsSelectProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleConfirm = (recipients: SelectedRecipient[]) => {
    onChange(recipients);
  };

  const removeRecipient = (id: string) => {
    onChange(value.filter(r => r.id !== id));
  };

  const totalCount = value.reduce((sum, r) => sum + (r.count ?? 1), 0);
  const hasSelections = value.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Label className="text-text-default text-sm font-medium">Send to</Label>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="bg-bg-input-soft text-text-default border-border-default flex h-9 w-full items-center justify-between rounded-md border px-3 text-sm"
        >
          <span className="flex items-center gap-2">
            <Group fill="var(--color-icon-default-muted)" className="size-4" />
            {hasSelections ? (
              <span className="text-text-default">{value.length} group{value.length !== 1 ? "s" : ""} selected</span>
            ) : (
              <span className="text-text-muted">Select recipients</span>
            )}
          </span>
          <ChevronDown className="text-icon-default-muted size-4" />
        </button>

        {/* Selected chips */}
        {hasSelections && (
          <div className="flex flex-wrap gap-1.5">
            {value.map(r => (
              <div
                key={r.id}
                className="bg-bg-badge-default border-border-default text-text-default flex items-center gap-1 rounded-md border px-2 py-1 text-xs"
              >
                {(r.type === "student" || r.type === "parent") && <User className="text-icon-default-muted size-3 shrink-0" />}
                <span className="max-w-30 truncate">
                  {r.label}
                  {r.count ? ` (${r.count})` : ""}
                </span>
                <button
                  type="button"
                  onClick={() => removeRecipient(r.id)}
                  aria-label={`Remove ${r.label}`}
                  className="hover:text-text-destructive ml-0.5 shrink-0"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-text-destructive text-xs">{error}</p>}
      </div>

      {/* Summary card */}
      <div className="border-border-default bg-bg-card-subtle flex items-center justify-between rounded-md border px-4 py-3">
        <div className="flex flex-col">
          <span className="text-text-default text-sm font-semibold">Selected Recipients</span>
          <span className="text-text-muted text-xs">
            {hasSelections
              ? `${value.length} group${value.length !== 1 ? "s" : ""}, ${totalCount} recipients`
              : "Select recipients to see breakdown"}
          </span>
        </div>
        <div className="bg-bg-state-strong text-text-white-default flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-xs font-medium">
          {value.length}
        </div>
      </div>

      <SelectRecipientsModal
        open={modalOpen}
        setOpen={setModalOpen}
        selected={value}
        onConfirm={handleConfirm}
      />
    </div>
  );
};
