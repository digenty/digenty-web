"use client";

import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import { useEffect, useRef, useState } from "react";

import { Attachment2, Bold, ImageCircleFill, Italic, Link as LinkIcon, ListCheck, ListOrdered2, Underline } from "@digenty/icons";

import { cn } from "@/lib/utils";
import { Label } from "../../ui/label";

type MessageEditorProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

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

export const MessageEditor = ({ value, onChange, error }: MessageEditorProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { class: "tiptap-link" },
      }),
      ImageExtension.configure({
        HTMLAttributes: { class: "tiptap-image" },
      }),
      Placeholder.configure({ placeholder: "Your message" }),
    ],
    content: value || "",
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });

  // Sync external value resets (e.g. enableReinitialize in EditCampaign)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const isActive = (name: string) => editor?.isActive(name) ?? false;

  const handleLink = () => {
    const existing = editor?.getAttributes("link").href ?? "";
    const url = window.prompt("Enter URL", existing);
    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor?.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
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
      editor?.chain().focus().setImage({ src: url, alt: file.name }).run();
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
      editor
        ?.chain()
        .focus()
        .insertContent(`<a href="${url}" target="_blank" rel="noopener noreferrer">${file.name}</a> `)
        .run();
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

        {/* Rich text content area */}
        <EditorContent editor={editor} className="tiptap-editor bg-bg-input-soft text-text-default min-h-[120px] px-3 py-2 text-sm" />

        {/* Toolbar */}
        <div className="bg-bg-input-soft border-border-default flex items-center gap-3 border-t px-3 py-2">
          {/* Format */}
          <div className="flex items-center gap-2">
            <ToolbarBtn onClick={() => editor?.chain().focus().toggleBold().run()} active={isActive("bold")} label="Bold">
              <Bold fill={iconFill(isActive("bold"))} className="size-4" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor?.chain().focus().toggleItalic().run()} active={isActive("italic")} label="Italic">
              <Italic fill={iconFill(isActive("italic"))} className="size-4" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor?.chain().focus().toggleUnderline().run()} active={isActive("underline")} label="Underline">
              <Underline fill={iconFill(isActive("underline"))} className="size-4" />
            </ToolbarBtn>
          </div>

          <span className="bg-border-default mx-1 h-4 w-px" />

          {/* Lists */}
          <div className="flex items-center gap-2">
            <ToolbarBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={isActive("orderedList")} label="Numbered list">
              <ListOrdered2 fill={iconFill(isActive("orderedList"))} className="size-4" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} active={isActive("bulletList")} label="Bulleted list">
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

      <span className="text-text-muted text-xs">Supports bold, italic, lists, links, images and attachments.</span>

      {error && <p className="text-text-destructive text-xs">{error}</p>}
    </div>
  );
};
