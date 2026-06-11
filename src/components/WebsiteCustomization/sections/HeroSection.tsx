"use client";

import { ImageCircleFill, ViewComfyAlt } from "@digenty/icons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Field, INPUT_CLASS } from "../common";
import { useWebsiteCustomization } from "../context";
import { ImageUploadRow } from "../ImageUpload";
import { SectionCard } from "../SectionCard";
import { HeroLayout, ROUTING_OPTIONS } from "../types";

const LayoutOption = ({ active, onClick, label, preview }: { active: boolean; onClick: () => void; label: string; preview: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex flex-1 flex-col gap-2 rounded-lg border p-2 text-left transition-colors",
      active ? "border-bg-state-primary ring-bg-state-primary/30 ring-1" : "border-border-default hover:border-border-darker",
    )}
  >
    <div className="bg-bg-muted h-24 overflow-hidden rounded-md">{preview}</div>
    <div className="flex items-center gap-1.5 px-1 pb-1">
      <ImageCircleFill fill="var(--color-icon-default-muted)" className="size-4" />
      <span className="text-text-default text-xs font-medium">{label}</span>
    </div>
  </button>
);

const MiniButton = () => <span className="bg-bg-state-primary inline-block h-3 w-8 rounded-sm" />;

export const HeroSection = () => {
  const { config, patchSection } = useWebsiteCustomization();
  const { hero } = config;

  const setLayout = (layout: HeroLayout) => patchSection("hero", { layout });

  return (
    <SectionCard
      icon={<ViewComfyAlt fill="var(--color-icon-default)" />}
      title="Hero Section"
      visible={hero.visible}
      onVisibleChange={value => patchSection("hero", { visible: value })}
    >
      <div className="flex gap-3">
        <LayoutOption
          active={hero.layout === "full-image"}
          onClick={() => setLayout("full-image")}
          label="Full Image Background"
          preview={
            <div className="bg-bg-inverted flex size-full flex-col items-center justify-center gap-1">
              <span className="text-text-white-default text-[0.5rem] font-semibold">School Title</span>
              <span className="text-text-white-muted text-[0.4rem]">Subtitle text</span>
              <MiniButton />
            </div>
          }
        />
        <LayoutOption
          active={hero.layout === "text-side-image"}
          onClick={() => setLayout("text-side-image")}
          label="Text + Side Image"
          preview={
            <div className="bg-bg-card flex size-full items-center gap-1.5 p-2">
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-text-default text-[0.5rem] font-semibold">School Title</span>
                <span className="text-text-muted text-[0.4rem]">Subtitle text</span>
                <MiniButton />
              </div>
              <div className="bg-bg-muted border-border-default h-full w-1/2 rounded-sm border" />
            </div>
          }
        />
      </div>

      <Field label="Background Image">
        <ImageUploadRow
          value={hero.backgroundImageUrl}
          onChange={url => patchSection("hero", { backgroundImageUrl: url })}
          hint="Landscape Image Recommended"
        />
      </Field>

      <Field label="Headline Text">
        <Input
          className={INPUT_CLASS}
          value={hero.headline}
          onChange={e => patchSection("hero", { headline: e.target.value })}
          placeholder="e.g Welcome to garfield"
        />
      </Field>

      <Field label="Subtitle / Tagline">
        <Textarea
          className={cn(INPUT_CLASS, "min-h-24 resize-none px-3 py-2")}
          value={hero.subtitle}
          onChange={e => patchSection("hero", { subtitle: e.target.value })}
          placeholder="A short description about your school"
        />
      </Field>

      <div className="flex gap-4">
        <Field label="Button Text" hint="Optional" className="flex-1">
          <Input
            className={INPUT_CLASS}
            value={hero.buttonText}
            onChange={e => patchSection("hero", { buttonText: e.target.value })}
            placeholder="e.g Apply for Admission"
          />
        </Field>

        <Field label="Button Link" hint="Optional" className="flex-1">
          <Select value={hero.buttonLink} onValueChange={value => patchSection("hero", { buttonLink: value })}>
            <SelectTrigger className={cn(INPUT_CLASS, "w-full")}>
              <SelectValue placeholder="Select Routing" />
            </SelectTrigger>
            <SelectContent>
              {ROUTING_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
    </SectionCard>
  );
};
