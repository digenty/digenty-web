"use client";

import { useState } from "react";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { WebsiteCustomizationProvider } from "./context";
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

const WebsiteCustomizationInner = () => {
  const [isSaving, setIsSaving] = useState(false);

  useBreadcrumb([{ label: "Website Customization", url: "/staff/website-customization" }]);

  const handleSave = () => {
    // Frontend-only for now — simulate a save and surface confirmation.
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({ title: "Saved", description: "Your website changes have been saved.", type: "success" });
    }, 600);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-text-default text-xl font-semibold">Website Customization</h1>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-9!"
        >
          {isSaving && <Spinner className="text-text-white-default size-3" />}
          Save
        </Button>
      </div>

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        {/* Editor column */}
        <div className="flex w-full flex-col gap-3 xl:w-115 xl:shrink-0 2xl:w-125">
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

        {/* Live preview */}
        <div className="w-full xl:sticky xl:top-8 xl:min-w-0 xl:flex-1">
          <LivePreview className="h-[60vh] min-h-110 xl:h-[calc(100vh-7rem)]" />
        </div>
      </div>
    </div>
  );
};

export const WebsiteCustomization = () => (
  <WebsiteCustomizationProvider>
    <WebsiteCustomizationInner />
  </WebsiteCustomizationProvider>
);
