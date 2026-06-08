"use client";

import { useEffect, useRef, useState } from "react";

import { Attachment2, Bold, ImageCircleFill, Italic, Link as LinkIcon, ListCheck, ListOrdered2, Underline } from "@digenty/icons";

import { cn } from "@/lib/utils";
import { useSmsCount } from "@/hooks/queryHooks/useCampaign";
import { RichEditorContent, useRichEditor } from "@/components/ui/rich-text-editor";
import { CampaignChannel } from "../types";
import { Label } from "../../ui/label";

type MessageEditorProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  channel?: CampaignChannel | "";
};

const htmlToText = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

type ToolbarBtnProps = {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
};

const ToolbarBtn = ({ onClick, active, label, children }: ToolbarBtnProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={cn("flex size-6 items-center justify-center rounded-sm", active ? "bg-bg-state-ghost-hover" : "hover:bg-bg-state-ghost-hover")}
  >
    {children}
  </button>
);

const iconFill = (active: boolean) => (active ? "var(--color-icon-default)" : "var(--color-icon-default-muted)");

export const MessageEditor = ({ value, onChange, error, channel }: MessageEditorProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { mutate: countSms, data: smsCount, reset: resetSmsCount } = useSmsCount();
  const plainText = htmlToText(value);
  const showSmsCount = channel === "SMS";

  const editor = useRichEditor({
    onUpdate: onChange,
    placeholder: "Your message",
  });

  // Sync external value resets (e.g. enableReinitialize in EditCampaign)
  useEffect(() => {
    if (editor.getHTML() !== value) {
      editor.setContent(value || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Live SMS segment count from /campaigns/sms/count (debounced) for SMS campaigns.
  useEffect(() => {
    if (!showSmsCount || !plainText) {
      resetSmsCount();
      return;
    }
    const timeout = setTimeout(() => countSms({ message: plainText }), 500);
    return () => clearTimeout(timeout);
  }, [plainText, showSmsCount, countSms, resetSmsCount]);

  const isActive = (name: string) => editor.isActive(name);

  const handleLink = () => {
    editor.saveSelection();
    const existing = editor.getLinkHref();
    const url = window.prompt("Enter URL", existing);
    if (url === null) return;
    if (url === "") {
      editor.removeLink();
    } else {
      editor.insertLink(url);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/image-upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const { url } = await res.json();
    return url as string;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      editor.insertImage(url, file.name);
    } catch {
      // silent — production would show a toast here
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleAttachmentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      editor.insertHTML(`<a href="${url}" target="_blank" rel="noopener noreferrer">${file.name}</a> `);
    } catch {
      // silent
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-text-default text-sm font-medium">Message Content</Label>

      <div
        className={cn(
          "border-border-default focus-within:border-ring focus-within:ring-border-highlight overflow-hidden rounded-md border focus-within:ring-2",
          error && "border-red-500",
        )}
      >
        {/* Hidden file inputs */}
        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        <input ref={attachmentInputRef} type="file" className="hidden" onChange={handleAttachmentChange} />

        <RichEditorContent editor={editor} initialContent={value} className="tiptap-editor bg-bg-input-soft text-text-default min-h-30 px-3 py-2 text-sm" />

        {/* Toolbar */}
        <div className="bg-bg-input-soft border-border-default flex items-center gap-3 border-t px-3 py-2">
          {/* Format */}
          <div className="flex items-center gap-2">
            <ToolbarBtn onClick={editor.toggleBold} active={isActive("bold")} label="Bold">
              <Bold fill={iconFill(isActive("bold"))} className="size-4" />
            </ToolbarBtn>
            <ToolbarBtn onClick={editor.toggleItalic} active={isActive("italic")} label="Italic">
              <Italic fill={iconFill(isActive("italic"))} className="size-4" />
            </ToolbarBtn>
            <ToolbarBtn onClick={editor.toggleUnderline} active={isActive("underline")} label="Underline">
              <Underline fill={iconFill(isActive("underline"))} className="size-4" />
            </ToolbarBtn>
          </div>

          <span className="bg-border-default mx-1 h-4 w-px" />

          {/* Lists */}
          <div className="flex items-center gap-2">
            <ToolbarBtn onClick={editor.toggleOrderedList} active={isActive("orderedList")} label="Numbered list">
              <ListOrdered2 fill={iconFill(isActive("orderedList"))} className="size-4" />
            </ToolbarBtn>
            <ToolbarBtn onClick={editor.toggleBulletList} active={isActive("bulletList")} label="Bulleted list">
              <ListCheck fill={iconFill(isActive("bulletList"))} className="size-4" />
            </ToolbarBtn>
          </div>

          <span className="bg-border-default mx-1 h-4 w-px" />

          {/* Media */}
          <div className="flex items-center gap-2">
            <ToolbarBtn onClick={handleLink} active={isActive("link")} label="Link">
              <LinkIcon fill={iconFill(isActive("link"))} className="size-4" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => imageInputRef.current?.click()} label="Image">
              <ImageCircleFill fill="var(--color-icon-default-muted)" className="size-4" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => attachmentInputRef.current?.click()} label="Attachment">
              <Attachment2 fill="var(--color-icon-default-muted)" className="size-4" />
            </ToolbarBtn>
          </div>

          {uploading && <span className="text-text-muted ml-auto text-xs">Uploading…</span>}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-text-muted text-xs">Supports bold, italic, lists, links, images and attachments.</span>
        {showSmsCount && smsCount && (
          <span className="text-text-muted shrink-0 text-xs">
            {smsCount.characterCount} chars · {smsCount.segmentCount} segment{smsCount.segmentCount === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {error && <p className="text-text-destructive text-xs">{error}</p>}
    </div>
  );
};
