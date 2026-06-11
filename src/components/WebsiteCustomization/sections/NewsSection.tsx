"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { BookOpen, DeleteBin } from "@digenty/icons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AddButton, Field, INPUT_CLASS } from "../common";
import { useWebsiteCustomization } from "../context";
import { ImageUploadRow } from "../ImageUpload";
import { SectionCard } from "../SectionCard";
import { uid } from "../defaults";
import { NewsItem } from "../types";

const NewsItemRow = ({ item, onChange, onRemove }: { item: NewsItem; onChange: (patch: Partial<NewsItem>) => void; onRemove: () => void }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-bg-subtle border-border-default rounded-md border">
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <span className="text-text-default truncate text-sm font-medium">{item.title || "News Item Name"}</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onRemove} aria-label="Remove news item" className="cursor-pointer">
            <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
          </button>
          <button type="button" onClick={() => setOpen(prev => !prev)} aria-label="Toggle news item" className="cursor-pointer">
            <ChevronDownIcon className={cn("text-icon-default-muted size-4 transition-transform", open && "rotate-180")} />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-border-default flex flex-col gap-4 border-t px-3 py-4">
          <Field label="Title">
            <Input className={INPUT_CLASS} value={item.title} onChange={e => onChange({ title: e.target.value })} placeholder="e.g Resumption Date" />
          </Field>
          <Field label="Date" hint="Optional">
            <Input className={INPUT_CLASS} value={item.date} onChange={e => onChange({ date: e.target.value })} placeholder="e.g 12 September 2025" />
          </Field>
          <Field label="Body">
            <Textarea
              className={cn(INPUT_CLASS, "min-h-20 resize-none px-3 py-2")}
              value={item.body}
              onChange={e => onChange({ body: e.target.value })}
              placeholder="Write the news details"
            />
          </Field>
          <Field label="Image" hint="Optional">
            <ImageUploadRow value={item.imageUrl} onChange={url => onChange({ imageUrl: url })} hint="Landscape Image Recommended" />
          </Field>
        </div>
      )}
    </div>
  );
};

export const NewsSection = () => {
  const { config, patchSection, setSection } = useWebsiteCustomization();
  const { news } = config;

  const updateItems = (items: NewsItem[]) => setSection("news", { ...news, items });

  return (
    <SectionCard
      icon={<BookOpen fill="var(--color-icon-default)" />}
      title="News & Updates"
      visible={news.visible}
      onVisibleChange={value => patchSection("news", { visible: value })}
    >
      <Field label="Section Title">
        <Input
          className={INPUT_CLASS}
          value={news.title}
          onChange={e => patchSection("news", { title: e.target.value })}
          placeholder="e.g Latest News & Updates"
        />
      </Field>

      <Field label="Section Subtitle" hint="Optional">
        <Input
          className={INPUT_CLASS}
          value={news.subtitle}
          onChange={e => patchSection("news", { subtitle: e.target.value })}
          placeholder="e.g Stay informed with the latest happenings at our school"
        />
      </Field>

      <Field
        label={`News Items (${news.items.length})`}
        hint={
          <AddButton
            label="Add News Item"
            onClick={() => updateItems([...news.items, { id: uid("news"), title: "", date: "", body: "", imageUrl: "" }])}
          />
        }
      >
        <div className="flex flex-col gap-2">
          {news.items.map(item => (
            <NewsItemRow
              key={item.id}
              item={item}
              onChange={patch => updateItems(news.items.map(i => (i.id === item.id ? { ...i, ...patch } : i)))}
              onRemove={() => updateItems(news.items.filter(i => i.id !== item.id))}
            />
          ))}
        </div>
      </Field>
    </SectionCard>
  );
};
