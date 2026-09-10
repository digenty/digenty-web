"use client";

import { DeleteBin } from "@digenty/icons";
import { useState } from "react";

import { DiaryEntryPayload, DiaryEntryType } from "@/api/diary";
import { DiaryCard, DiaryCardHeader } from "@/components/DailyDiary/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DIARY_ENTRY_TYPE_CONFIG, DIARY_ENTRY_TYPE_OPTIONS } from "@/queries/diary";

type Props = {
  entries: DiaryEntryPayload[];
  onChange: (entries: DiaryEntryPayload[]) => void;
  allowedTypes: DiaryEntryType[];
  disabled?: boolean;
};

const emptyRow = (position: number): DiaryEntryPayload => ({
  activity: "",
  note: "",
  type: "CLASS_NOTE",
  dueDate: null,
  position,
});

const HEADERS = ["Day / Subject", "Notes / Reminders", "Type", "Due date"];

export const EntriesTable = ({ entries, onChange, allowedTypes, disabled }: Props) => {
  const [draft, setDraft] = useState<DiaryEntryPayload>(emptyRow(0));

  const typeOptions = DIARY_ENTRY_TYPE_OPTIONS.filter(option => allowedTypes.includes(option.value));

  const update = (index: number, patch: Partial<DiaryEntryPayload>) => {
    onChange(
      entries.map((entry, i) => {
        if (i !== index) return entry;
        const next = { ...entry, ...patch };
        // Class notes have no due date in the paper diary either, so clear it when the type changes.
        if (patch.type && !DIARY_ENTRY_TYPE_CONFIG[patch.type].requiresDueDate) next.dueDate = null;
        return next;
      }),
    );
  };

  const remove = (index: number) => onChange(entries.filter((_, i) => i !== index).map((entry, i) => ({ ...entry, position: i })));

  const commitDraft = () => {
    if (!draft.activity.trim() && !draft.note.trim()) return;
    onChange([...entries, { ...draft, position: entries.length }]);
    setDraft(emptyRow(entries.length + 1));
  };

  const addBlankRow = () => onChange([...entries, emptyRow(entries.length)]);

  const renderTypeSelect = (value: DiaryEntryType, onValueChange: (type: DiaryEntryType) => void, label: string) => (
    <Select value={value} onValueChange={next => onValueChange(next as DiaryEntryType)} disabled={disabled}>
      <SelectTrigger className="border-border-default h-9 w-full border text-[13px] focus-visible:ring-0" aria-label={label}>
        <SelectValue placeholder="Select type" />
      </SelectTrigger>
      <SelectContent className="bg-bg-card border-border-default border">
        {typeOptions.map(option => (
          <SelectItem key={option.value} value={option.value} className="text-text-default text-sm">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <DiaryCard>
      <DiaryCardHeader title="Today's entries" description="One row per activity, note or reminder — the same columns as the paper diary." />

      {/* Desktop: the paper diary's column layout. */}
      <div className="hidden md:block">
        <div className="bg-bg-basic-gray-alpha-4 grid grid-cols-[minmax(140px,1fr)_minmax(240px,2.4fr)_minmax(140px,0.9fr)_minmax(150px,0.9fr)_44px] gap-3 px-4 py-2.5">
          {HEADERS.map(header => (
            <p key={header} className="text-text-muted text-[11px] leading-4 font-medium tracking-wide uppercase">
              {header}
            </p>
          ))}
          <span className="sr-only">Actions</span>
        </div>

        {entries.map((entry, index) => (
          <div
            key={entry.id ?? `row-${index}`}
            className="border-border-default grid grid-cols-[minmax(140px,1fr)_minmax(240px,2.4fr)_minmax(140px,0.9fr)_minmax(150px,0.9fr)_44px] items-start gap-3 border-t px-4 py-3"
          >
            <Input
              value={entry.activity}
              onChange={event => update(index, { activity: event.target.value })}
              placeholder="Add activity or subject"
              aria-label={`Activity for row ${index + 1}`}
              disabled={disabled}
              className="border-border-default h-9 text-[13px]"
            />
            <Textarea
              value={entry.note}
              onChange={event => update(index, { note: event.target.value })}
              placeholder="Type a note or reminder for parents…"
              aria-label={`Note for row ${index + 1}`}
              disabled={disabled}
              rows={2}
              className="border-border-default min-h-9 resize-y text-[13px]"
            />
            {renderTypeSelect(entry.type, type => update(index, { type }), `Type for row ${index + 1}`)}
            <Input
              type="date"
              value={entry.dueDate ?? ""}
              onChange={event => update(index, { dueDate: event.target.value || null })}
              aria-label={`Due date for row ${index + 1}`}
              disabled={disabled || !DIARY_ENTRY_TYPE_CONFIG[entry.type].requiresDueDate}
              className="border-border-default h-9 text-[13px] disabled:opacity-40"
            />
            <Button
              variant="ghost"
              onClick={() => remove(index)}
              disabled={disabled}
              aria-label={`Remove row ${index + 1}`}
              className="hover:bg-bg-state-soft mt-0.5 size-9 justify-center rounded-md"
            >
              <DeleteBin fill="var(--color-icon-default-muted)" className="size-4" />
            </Button>
          </div>
        ))}

        {/* Ghost row: type here and it becomes a real row, matching the design's inline add. */}
        <div className="border-border-default grid grid-cols-[minmax(140px,1fr)_minmax(240px,2.4fr)_minmax(140px,0.9fr)_minmax(150px,0.9fr)_44px] items-start gap-3 border-t px-4 py-3">
          <Input
            value={draft.activity}
            onChange={event => setDraft({ ...draft, activity: event.target.value })}
            onBlur={commitDraft}
            placeholder="Add activity or subject"
            aria-label="New row activity"
            disabled={disabled}
            className="border-border-default h-9 text-[13px]"
          />
          <Textarea
            value={draft.note}
            onChange={event => setDraft({ ...draft, note: event.target.value })}
            onBlur={commitDraft}
            placeholder="Type a note or reminder for parents…"
            aria-label="New row note"
            disabled={disabled}
            rows={2}
            className="border-border-default min-h-9 resize-y text-[13px]"
          />
          {renderTypeSelect(draft.type, type => setDraft({ ...draft, type }), "New row type")}
          <Input
            type="date"
            value={draft.dueDate ?? ""}
            onChange={event => setDraft({ ...draft, dueDate: event.target.value || null })}
            aria-label="New row due date"
            disabled={disabled || !DIARY_ENTRY_TYPE_CONFIG[draft.type].requiresDueDate}
            className="border-border-default h-9 text-[13px] disabled:opacity-40"
          />
          <span />
        </div>
      </div>

      {/* Mobile: one stacked card per row — a teacher writing at the end of the day is on a phone. */}
      <div className="md:hidden">
        {entries.map((entry, index) => (
          <div key={entry.id ?? `m-row-${index}`} className="border-border-default flex flex-col gap-3 border-t p-4">
            <div className="flex items-center gap-2">
              <Input
                value={entry.activity}
                onChange={event => update(index, { activity: event.target.value })}
                placeholder="Activity or subject"
                aria-label={`Activity for row ${index + 1}`}
                disabled={disabled}
                className="border-border-default h-9 flex-1 text-[13px]"
              />
              <Button
                variant="ghost"
                onClick={() => remove(index)}
                disabled={disabled}
                aria-label={`Remove row ${index + 1}`}
                className="hover:bg-bg-state-soft size-9 shrink-0 justify-center rounded-md"
              >
                <DeleteBin fill="var(--color-icon-default-muted)" className="size-4" />
              </Button>
            </div>
            <Textarea
              value={entry.note}
              onChange={event => update(index, { note: event.target.value })}
              placeholder="Type a note or reminder for parents…"
              aria-label={`Note for row ${index + 1}`}
              disabled={disabled}
              rows={3}
              className="border-border-default text-[13px]"
            />
            <div className="flex gap-2">
              <div className="flex-1">{renderTypeSelect(entry.type, type => update(index, { type }), `Type for row ${index + 1}`)}</div>
              <Input
                type="date"
                value={entry.dueDate ?? ""}
                onChange={event => update(index, { dueDate: event.target.value || null })}
                aria-label={`Due date for row ${index + 1}`}
                disabled={disabled || !DIARY_ENTRY_TYPE_CONFIG[entry.type].requiresDueDate}
                className="border-border-default h-9 flex-1 text-[13px] disabled:opacity-40"
              />
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-text-muted border-border-default border-t p-4 text-[13px]">No entries yet. Add your first row below.</p>
        )}
      </div>

      <div className="flex flex-col gap-3 px-4 pt-3 pb-4 sm:flex-row sm:items-center">
        <Button variant="outline" onClick={addBlankRow} disabled={disabled} className="border-border-darker text-text-default bg-bg-card rounded-md">
          + Add row
        </Button>
        <div className="flex-1" />
        <p className="text-text-muted text-xs leading-4">Homework rows appear on the parent&apos;s &ldquo;To do&rdquo; list until the due date.</p>
      </div>
    </DiaryCard>
  );
};
