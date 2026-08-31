"use client";

import { X } from "lucide-react";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { Spinner } from "@/components/ui/spinner";
import { useGetWebsiteConfig } from "@/hooks/queryHooks/useWebsite";
import { WebsiteRenderer } from "./WebsiteRenderer";

export const WebsitePreviewPage = () => {
  const { data, isLoading, isError, refetch } = useGetWebsiteConfig();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorComponent
          title="Could not load preview"
          description="This website hasn't been saved yet, or the link is invalid."
          buttonText="Retry"
          onClick={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-zinc-900 px-4 py-2 text-xs text-white">
        <span className="font-medium">Preview — this is a draft, not your live site</span>
        <button
          type="button"
          onClick={() => window.close()}
          aria-label="Close preview"
          className="flex size-6 items-center justify-center rounded hover:bg-white/10"
        >
          <X className="size-3.5" />
        </button>
      </div>
      <WebsiteRenderer dto={data} />
    </div>
  );
};
