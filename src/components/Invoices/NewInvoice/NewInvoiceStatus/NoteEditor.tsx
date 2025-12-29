"use client";

import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Bold } from "@/components/Icons/Bold";
import { Italic } from "@/components/Icons/Italic";
import { Button } from "@/components/ui/button";
import { Underline } from "@/components/Icons/Underline";
import { ListOrdered2 } from "@/components/Icons/ListOrdered2";
import { Link } from "@/components/Icons/Link";
import { ImageCircleFill } from "@/components/Icons/ImageCircleFill";
import { Attachment2 } from "@/components/Icons/Attachment2";
import { Input } from "@/components/ui/input";
import { LineVerticale } from "@/components/Icons/LineVerticale";
import { ListCheck3 } from "@/components/Icons/ListCheck3";

type NoteEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function NoteEditor({ value, onChange }: NoteEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = (command: string) => {
    editorRef.current?.focus();
    document.execCommand(command);
    onChange(editorRef.current?.innerHTML || "");
  };

  const handleInput = () => {
    onChange(editorRef.current?.innerHTML || "");
  };

  const handleFileUpload = (file: File) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.textContent = file.name;
    link.target = "_blank";

    editorRef.current?.appendChild(link);
    editorRef.current?.appendChild(document.createElement("br"));

    onChange(editorRef.current?.innerHTML || "");
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <Label className="text-text-default mb-1 block text-sm font-medium">Note</Label>

      <div className="border-border-default bg-bg-input-soft h-46 w-full rounded-md border">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="text-text-muted h-35 px-3 py-2 text-sm outline-none"
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: value }}
          aria-placeholder="Your note"
        />

        <div className="border-border-default flex items-center border-t px-2 py-0.5 md:gap-1">
          <Button onClick={() => exec("bold")} className="hover:bg-bg-state-soft-hover! h-7 w-7 rounded-md">
            <Bold fill="var(--color-icon-default-muted)" />
          </Button>

          <Button onClick={() => exec("italic")} className="hover:bg-bg-state-soft-hover! h-7 w-7 rounded">
            <Italic fill="var(--color-icon-default-muted)" />
          </Button>

          <Button onClick={() => exec("underline")} className="hover:bg-bg-state-soft-hover! h-7 w-7 rounded-md">
            <Underline fill="var(--color-icon-default-muted)" />
          </Button>

          <LineVerticale stroke="var(--color-icon-default-muted)" />

          <Button className="hover:bg-bg-state-soft-hover! h-7 w-7 rounded-md">
            <ListOrdered2 fill="var(--color-icon-default-muted)" />
          </Button>

          <Button className="hover:bg-bg-state-soft-hover! h-7 w-7 rounded-md">
            <ListCheck3 fill="var(--color-icon-default-muted)" />
          </Button>

          <LineVerticale stroke="var(--color-icon-default-muted)" />

          <Button className="hover:bg-bg-state-soft-hover! h-7 w-7 rounded-md">
            <Link fill="var(--color-icon-default-muted)" />
          </Button>
          <Button className="hover:bg-bg-state-soft-hover! h-7 w-7 cursor-pointer rounded-md">
            <Label className="">
              <ImageCircleFill fill="var(--color-icon-default-muted)" />
              <Input type="file" className="hidden" onChange={e => e.target.files && handleFileUpload(e.target.files[0])} />
            </Label>
          </Button>
          <Button className="hover:bg-bg-state-soft-hover! cursor-pointer rounded-md">
            <Attachment2 fill="var(--color-icon-default-muted)" />
          </Button>
        </div>
      </div>
    </div>
  );
}
