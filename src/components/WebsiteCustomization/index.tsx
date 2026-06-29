"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { cn } from "@/lib/utils";
import { useWebsiteCustomization, WebsiteCustomizationProvider } from "./context";
import { LivePreview } from "./preview/LivePreview";
import { SchoolIdentitySection } from "./sections/SchoolIdentitySection";
import { ThemeSection } from "./sections/ThemeSection";
import { HeroSection } from "./sections/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { GallerySection } from "./sections/GallerySection";
import { NewsSection } from "./sections/NewsSection";
import { AdmissionsSection } from "./sections/AdmissionsSection";
import { ContactSection } from "./sections/ContactSection";
import { FooterSection } from "./sections/FooterSection";

const EditorColumn = ({ className }: { className?: string }) => (
  <div className={cn("w-full flex-col gap-3 xl:flex xl:w-115 xl:shrink-0 2xl:w-125", className)}>
    <SchoolIdentitySection />
    <ThemeSection />

    <div className="mt-2 mb-1">
      <h2 className="text-text-default text-sm font-semibold">Page Sections</h2>
      <p className="text-text-muted text-xs">Toggle visibility and edit each section</p>
    </div>

    <HeroSection />
    <AboutSection />
    <GallerySection />
    <NewsSection />
    <AdmissionsSection />
    <ContactSection />
    <FooterSection />
  </div>
);

const WebsiteCustomizationInner = () => {
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");
  const { save, publish, startEdit, cancelEdit, isSaving, isPublishing, isLoading, live, hasData, isEditing } = useWebsiteCustomization();

  useBreadcrumb([{ label: "Website Customization", url: "/staff/website-customization" }]);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-text-default text-xl font-semibold">Website Customization</h1>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium",
              live ? "bg-bg-badge-green text-text-success" : "bg-bg-state-soft text-text-muted",
            )}
          >
            {live ? "Live" : "Draft"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {hasData && (
            <Button
              onClick={publish}
              disabled={isPublishing || isLoading || isEditing}
              className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-9! rounded-md border text-sm font-medium shadow-xs"
            >
              {isPublishing && <Spinner className="size-3" />}
              {live ? "Unpublish" : "Publish"}
            </Button>
          )}

          {hasData && !isEditing ? (
            <Button onClick={startEdit} className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-9!">
              Edit
            </Button>
          ) : (
            <>
              {hasData && (
                <Button
                  onClick={cancelEdit}
                  disabled={isSaving}
                  className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-9! rounded-md border text-sm font-medium shadow-xs"
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={save}
                disabled={isSaving || isLoading}
                className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-9!"
              >
                {isSaving && <Spinner className="text-text-white-default size-3" />}
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
          <div className="flex w-full flex-col gap-3 xl:w-115 xl:shrink-0 2xl:w-125">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="bg-bg-input-soft h-16 w-full rounded-md" />
            ))}
          </div>
          <Skeleton className="bg-bg-input-soft h-[60vh] min-h-110 w-full rounded-xl xl:flex-1" />
        </div>
      ) : (
        <>
          {/* Mobile / tablet tab switcher — side-by-side becomes Editor / Preview tabs below xl */}
          <div className="bg-bg-input-soft mb-5 flex gap-1 rounded-lg p-1 xl:hidden">
            {(["editor", "preview"] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setMobileTab(tab)}
                className={cn(
                  "flex-1 cursor-pointer rounded-md py-2 text-sm font-medium capitalize transition-colors",
                  mobileTab === tab ? "bg-bg-card text-text-default shadow-xs" : "text-text-muted",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
            <EditorColumn className={mobileTab === "editor" ? "flex" : "hidden"} />

            <div className={cn("w-full xl:sticky xl:top-8 xl:block xl:min-w-0 xl:flex-1", mobileTab === "preview" ? "block" : "hidden")}>
              <LivePreview className="h-[calc(100vh-13rem)] min-h-110 xl:h-[calc(100vh-7rem)]" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const WebsiteCustomization = () => (
  <WebsiteCustomizationProvider>
    <WebsiteCustomizationInner />
  </WebsiteCustomizationProvider>
);
