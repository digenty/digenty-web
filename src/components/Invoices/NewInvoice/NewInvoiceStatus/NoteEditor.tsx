"use client";

import { Bold, Italic, LineVerticale, Link, ListCheck3, ListOrdered2, Underline } from "@digenty/icons";
import { RichEditorContent, useRichEditor } from "@/components/ui/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type NoteEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function NoteEditor({ value, onChange }: NoteEditorProps) {
  const [linkPromptOpen, setLinkPromptOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useRichEditor({ onUpdate: onChange, placeholder: "Add a note..." });

  const prevValueRef = useRef(value);
  useEffect(() => {
    if (value !== prevValueRef.current && value !== editor.getHTML()) {
      editor.setContent(value);
    }
    prevValueRef.current = value;
  }, [value, editor]);

  const handleLinkClick = () => {
    editor.saveSelection();
    setLinkUrl(editor.getLinkHref());
    setLinkPromptOpen(true);
  };

  const handleLinkConfirm = () => {
    if (linkUrl.trim()) {
      editor.insertLink(linkUrl.trim());
    } else {
      editor.removeLink();
    }
    setLinkPromptOpen(false);
    setLinkUrl("");
  };

  const btn = (active: boolean) => cn("hover:bg-bg-state-soft-hover! h-7 w-7 rounded-md", active && "bg-bg-state-soft");

  return (
    <div className="flex w-full flex-col gap-2">
      <Label className="text-text-default mb-1 block text-sm font-medium">Note</Label>

      <div className="border-border-default bg-bg-input-soft min-h-46 w-full rounded-md border">
        <RichEditorContent editor={editor} initialContent={value} className="tiptap-editor text-text-default min-h-35 px-3 py-2 text-sm" />

        {linkPromptOpen && (
          <div className="border-border-default flex items-center gap-2 border-t px-3 py-1.5">
            <Input
              autoFocus
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") handleLinkConfirm();
                if (e.key === "Escape") setLinkPromptOpen(false);
              }}
              placeholder="https://..."
              className="bg-bg-input-soft h-7 border-none text-sm"
            />
            <Button type="button" onClick={handleLinkConfirm} className="bg-bg-state-primary text-text-white-default h-7 rounded-sm px-2 text-xs">
              Apply
            </Button>
            <Button
              type="button"
              onClick={() => setLinkPromptOpen(false)}
              className="bg-bg-state-soft text-text-subtle h-7 rounded-sm border-none px-2 text-xs"
            >
              Cancel
            </Button>
          </div>
        )}

        <div className="border-border-default flex items-center border-t px-2 py-0.5 md:gap-1">
          <Button type="button" onClick={() => editor.toggleBold()} className={btn(editor.isActive("bold"))}>
            <Bold fill="var(--color-icon-default-muted)" />
          </Button>

          <Button type="button" onClick={() => editor.toggleItalic()} className={btn(editor.isActive("italic"))}>
            <Italic fill="var(--color-icon-default-muted)" />
          </Button>

          <Button type="button" onClick={() => editor.toggleUnderline()} className={btn(editor.isActive("underline"))}>
            <Underline fill="var(--color-icon-default-muted)" />
          </Button>

          <LineVerticale stroke="var(--color-icon-default-muted)" />

          <Button type="button" onClick={() => editor.toggleOrderedList()} className={btn(editor.isActive("orderedList"))}>
            <ListOrdered2 fill="var(--color-icon-default-muted)" />
          </Button>

          <Button type="button" onClick={() => editor.toggleBulletList()} className={btn(editor.isActive("bulletList"))}>
            <ListCheck3 fill="var(--color-icon-default-muted)" />
          </Button>

          <LineVerticale stroke="var(--color-icon-default-muted)" />

          <Button type="button" onClick={handleLinkClick} className={btn(editor.isActive("link"))}>
            <Link fill="var(--color-icon-default-muted)" />
          </Button>
        </div>
      </div>
    </div>
  );
}
