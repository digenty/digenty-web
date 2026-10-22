"use client";

import { uploadImage } from "@/app/actions/upload-image";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { PointerEvent, useCallback, useEffect, useRef, useState } from "react";

type Mode = "draw" | "upload";

const INK = "#111827";
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const OUTPUT_MAX_WIDTH = 600;

// Crops the canvas to the ink bounds (plus padding) and returns it as a transparent PNG, scaled down to a sensible width.
const exportTrimmed = (source: HTMLCanvasElement): Promise<Blob | null> => {
  const ctx = source.getContext("2d");
  if (!ctx) return Promise.resolve(null);

  const { width, height } = source;
  const { data } = ctx.getImageData(0, 0, width, height);
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < 0) return Promise.resolve(null);

  const pad = 8;
  const sx = Math.max(0, minX - pad);
  const sy = Math.max(0, minY - pad);
  const sw = Math.min(width, maxX + pad) - sx;
  const sh = Math.min(height, maxY + pad) - sy;
  const scale = Math.min(1, OUTPUT_MAX_WIDTH / sw);

  const out = document.createElement("canvas");
  out.width = Math.round(sw * scale);
  out.height = Math.round(sh * scale);
  out.getContext("2d")?.drawImage(source, sx, sy, sw, sh, 0, 0, out.width, out.height);

  return new Promise(resolve => out.toBlob(resolve, "image/png"));
};

// Photo of a pen signature on white paper -> same ink colour on a transparent background (near-white fades out).
const imageFileToCanvas = (file: File): Promise<HTMLCanvasElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, 1200 / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return reject(new Error("Canvas unavailable"));

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const px = imageData.data;
      const low = 150;
      const high = 220;

      for (let i = 0; i < px.length; i += 4) {
        const luminance = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
        const alpha = luminance >= high ? 0 : luminance <= low ? 255 : Math.round(((high - luminance) / (high - low)) * 255);
        px[i] = 17;
        px[i + 1] = 24;
        px[i + 2] = 39;
        px[i + 3] = Math.min(px[i + 3], alpha);
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });

export const SignatureSection = ({
  signature,
  isSaving,
  onSave,
}: {
  signature?: string | null;
  isSaving: boolean;
  onSave: (url: string) => void;
}) => {
  const [mode, setMode] = useState<Mode>("draw");
  const [hasInk, setHasInk] = useState(false);
  const [uploadCanvas, setUploadCanvas] = useState<HTMLCanvasElement | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const drawing = useRef(false);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.lineWidth = 2.5 * ratio;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = INK;
    setHasInk(false);
  }, []);

  useEffect(() => {
    if (mode === "draw") setupCanvas();
  }, [mode, setupCanvas]);

  const pointFrom = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const ratio = canvas.width / rect.width;
    return { x: (e.clientX - rect.left) * ratio, y: (e.clientY - rect.top) * ratio };
  };

  const handleDown = (e: PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    const { x, y } = pointFrom(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    // A tap should leave a dot
    ctx.lineTo(x + 0.01, y);
    ctx.stroke();
    setHasInk(true);
  };

  const handleMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = pointFrom(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleUp = () => {
    drawing.current = false;
  };

  const clearDrawing = () => setupCanvas();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      toast({ title: "Invalid file type", description: "Please upload a JPG or PNG image.", type: "error" });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "File too large", description: "Max file size is 2MB.", type: "error" });
      return;
    }

    try {
      const canvas = await imageFileToCanvas(file);
      const blob = await exportTrimmed(canvas);
      if (!blob) {
        toast({ title: "No signature found", description: "Use dark ink on plain white paper and try again.", type: "error" });
        return;
      }
      setUploadCanvas(canvas);
      setUploadPreview(URL.createObjectURL(blob));
    } catch {
      toast({ title: "Could not read image", description: "Try a different photo.", type: "error" });
    }
  };

  const clearUpload = () => {
    if (uploadPreview) URL.revokeObjectURL(uploadPreview);
    setUploadCanvas(null);
    setUploadPreview(null);
  };

  const canSave = mode === "draw" ? hasInk : !!uploadCanvas;

  const handleSave = async () => {
    const source = mode === "draw" ? canvasRef.current : uploadCanvas;
    if (!source) return;

    setIsUploading(true);
    try {
      const blob = await exportTrimmed(source);
      if (!blob) {
        toast({ title: "Nothing to save", description: "Add your signature first.", type: "error" });
        return;
      }
      const formData = new FormData();
      formData.append("file", new File([blob], "signature.png", { type: "image/png" }));
      const result = await uploadImage(formData);
      if (!result?.url) {
        toast({ title: "Upload failed", description: "Could not upload your signature.", type: "error" });
        return;
      }
      onSave(result.url);
      if (mode === "draw") clearDrawing();
      else clearUpload();
    } finally {
      setIsUploading(false);
    }
  };

  const busy = isUploading || isSaving;

  return (
    <div className="border-border-default flex flex-col gap-4 border-b py-4">
      <div>
        <div className="text-text-default text-sm font-medium">Signature</div>
        <div className="text-text-muted text-xs">Shown on report cards you are responsible for.</div>
      </div>

      {signature && (
        <div className="border-border-default flex h-24 items-center justify-center rounded-md border bg-white p-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- remote user-uploaded image */}
          <img src={signature} alt="Your current signature" className="max-h-full object-contain" />
        </div>
      )}

      <div className="bg-bg-input-soft flex w-fit gap-1 rounded-md p-1">
        {(["draw", "upload"] as Mode[]).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "rounded-sm px-3 py-1 text-xs font-medium capitalize",
              mode === m ? "bg-bg-state-secondary text-text-default shadow" : "text-text-muted",
            )}
          >
            {m === "draw" ? "Draw" : "Upload photo"}
          </button>
        ))}
      </div>

      {mode === "draw" ? (
        <div className="flex flex-col gap-2">
          <canvas
            ref={canvasRef}
            onPointerDown={handleDown}
            onPointerMove={handleMove}
            onPointerUp={handleUp}
            onPointerCancel={handleUp}
            className="border-border-darker h-40 w-full cursor-crosshair touch-none rounded-md border border-dashed bg-white"
          />
          <div className="text-text-muted text-xs">Sign inside the box using your finger, stylus or mouse.</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <input ref={fileRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleFile} aria-label="Upload signature photo" />
          {uploadPreview ? (
            <div className="border-border-darker flex h-40 items-center justify-center rounded-md border border-dashed bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
              <img src={uploadPreview} alt="Signature preview" className="max-h-full object-contain" />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="border-border-darker text-text-muted h-40 w-full rounded-md border border-dashed text-sm"
            >
              Choose a photo of your signature
            </button>
          )}
          <div className="text-text-muted text-xs">Sign with dark ink on plain white paper. The background is removed automatically. JPG or PNG, 2MB max.</div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button
          onClick={mode === "draw" ? clearDrawing : clearUpload}
          disabled={busy || !canSave}
          className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! w-fit rounded-md border text-sm font-medium"
        >
          Clear
        </Button>
        <Button
          onClick={handleSave}
          disabled={busy || !canSave}
          className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7!"
        >
          {busy && <Spinner className="size-3" />}
          Save signature
        </Button>
      </div>
    </div>
  );
};
