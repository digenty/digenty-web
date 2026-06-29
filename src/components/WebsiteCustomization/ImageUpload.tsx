"use client";

import { useRef, useState } from "react";
import { DeleteBin, ImageCircleFill } from "@digenty/icons";
import { uploadWebsiteImage } from "@/api/website";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { SquareIconButton } from "./common";

const getUploadErrorMessage = (error: unknown) => {
  if (error && typeof error === "object") {
    const e = error as { message?: string; error?: string };
    return e.message || e.error || "Could not upload image. Please try again.";
  }
  return "Could not upload image. Please try again.";
};

const useUploader = (onChange: (url: string) => void, type?: string) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const open = () => inputRef.current?.click();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadWebsiteImage(file, type);
      if (result?.url) onChange(result.url);
      else toast({ title: "Upload failed", description: "Could not upload image.", type: "error" });
    } catch (error) {
      toast({ title: "Upload failed", description: getUploadErrorMessage(error), type: "error" });
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return { inputRef, isUploading, open, handleChange };
};

/** Inline upload row: preview square + Upload button + delete + hint. */
export const ImageUploadRow = ({
  value,
  onChange,
  hint,
  type,
  disabled,
}: {
  value: string;
  onChange: (url: string) => void;
  hint: string;
  type?: string;
  disabled?: boolean;
}) => {
  const { inputRef, isUploading, open, handleChange } = useUploader(onChange, type);

  return (
    <div className="flex items-center gap-3">
      <input ref={inputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleChange} aria-label="Upload image" />

      <div className="bg-bg-input-soft relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Preview" className="absolute inset-0 size-full object-cover" />
        ) : (
          <ImageCircleFill fill="var(--color-icon-default-disabled)" className="size-5" />
        )}
      </div>

      {!disabled && (
        <>
          <Button
            onClick={open}
            disabled={isUploading}
            className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-9! rounded-md border text-sm font-medium shadow-xs"
          >
            {isUploading && <Spinner className="size-3" />}
            Upload
          </Button>

          <SquareIconButton onClick={() => onChange("")} aria-label="Remove image">
            <DeleteBin fill="var(--color-icon-default-muted)" className="size-4" />
          </SquareIconButton>
        </>
      )}

      <span className="text-text-muted text-xs">{hint}</span>
    </div>
  );
};

/** Square drop box used for gallery / news thumbnails. */
export const ImageDropBox = ({
  value,
  onChange,
  className,
  type,
  disabled,
}: {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  type?: string;
  disabled?: boolean;
}) => {
  const { inputRef, isUploading, open, handleChange } = useUploader(onChange, type);

  return (
    <button
      type="button"
      onClick={disabled ? undefined : open}
      disabled={disabled}
      className={cn(
        "bg-bg-input-soft border-border-default group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border transition-colors",
        !disabled && "hover:bg-bg-state-soft-hover",
        className,
      )}
    >
      <input ref={inputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleChange} aria-label="Upload image" />

      {value ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Gallery item" className="absolute inset-0 size-full object-cover" />
          {!disabled && (
            <span
              onClick={e => {
                e.stopPropagation();
                onChange("");
              }}
              className="bg-bg-overlay absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-md opacity-0 transition-opacity group-hover:opacity-100"
            >
              <DeleteBin fill="var(--color-icon-white-default)" className="size-3.5" />
            </span>
          )}
        </>
      ) : isUploading ? (
        <Spinner className="size-5" />
      ) : (
        <ImageCircleFill fill="var(--color-icon-default-disabled)" className="size-6" />
      )}
    </button>
  );
};
