"use client";

import { useState } from "react";
import { Monitor, RotateCw, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebsiteCustomization } from "../context";
import { WebsitePreview } from "./WebsitePreview";

type Device = "desktop" | "mobile";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .replace(/^-+|-+$/g, "") || "yourschool";

export const LivePreview = ({ className }: { className?: string }) => {
  const { config } = useWebsiteCustomization();
  const [device, setDevice] = useState<Device>("desktop");
  const [nonce, setNonce] = useState(0);

  const domain = `${slugify(config.schoolIdentity.name)}.axis.org`;

  return (
    <div className={cn("border-border-default bg-bg-card flex flex-col overflow-hidden rounded-xl border shadow-xs", className)}>
      {/* Browser chrome */}
      <div className="border-border-default flex items-center gap-3 border-b px-3 py-2.5 sm:px-4">
        <div className="hidden items-center gap-1.5 sm:flex">
          <span className="size-3 rounded-full bg-[#ed6a5e]" />
          <span className="size-3 rounded-full bg-[#f4bf4f]" />
          <span className="size-3 rounded-full bg-[#61c554]" />
        </div>

        <div className="bg-bg-input-soft text-text-muted flex min-w-0 flex-1 items-center gap-2 rounded-md px-3 py-1.5 text-xs">
          <span className="text-icon-success shrink-0">🔒</span>
          <span className="truncate">{domain}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-text-muted hidden text-xs font-medium lg:block">Live Preview</span>
          <button
            type="button"
            onClick={() => setNonce(n => n + 1)}
            aria-label="Refresh preview"
            className="hover:bg-bg-state-soft-hover flex size-7 cursor-pointer items-center justify-center rounded-md"
          >
            <RotateCw className="text-icon-default-muted size-3.5" />
          </button>
          <div className="bg-bg-input-soft flex items-center gap-0.5 rounded-md p-0.5">
            <button
              type="button"
              onClick={() => setDevice("desktop")}
              aria-label="Desktop preview"
              className={cn("flex size-6 cursor-pointer items-center justify-center rounded", device === "desktop" && "bg-bg-card shadow-xs")}
            >
              <Monitor className="text-icon-default-muted size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDevice("mobile")}
              aria-label="Mobile preview"
              className={cn("flex size-6 cursor-pointer items-center justify-center rounded", device === "mobile" && "bg-bg-card shadow-xs")}
            >
              <Smartphone className="text-icon-default-muted size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Responsive website viewport — content reflows to the container width via @container queries. */}
      <div className="bg-bg-muted flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-4">
        <div
          key={nonce}
          className={cn(
            "@container mx-auto overflow-hidden rounded-lg bg-white shadow-sm transition-[max-width] duration-300",
            device === "mobile" ? "max-w-97.5" : "max-w-full",
          )}
        >
          <WebsitePreview config={config} />
        </div>
      </div>
    </div>
  );
};
