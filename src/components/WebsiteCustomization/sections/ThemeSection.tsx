"use client";

import { ColorFilter } from "@digenty/icons";
import { Input } from "@/components/ui/input";
import { Field, INPUT_CLASS } from "../common";
import { useWebsiteCustomization } from "../context";
import { SectionCard } from "../SectionCard";

export const ThemeSection = () => {
  const { config, patchSection } = useWebsiteCustomization();
  const { primaryColor } = config.theme;

  return (
    <SectionCard icon={<ColorFilter fill="var(--color-icon-default)" />} title="Theme">
      <Field label="Primary Colour">
        <div className="flex items-center gap-3">
          <label
            className="border-border-default relative h-9 w-14 shrink-0 cursor-pointer overflow-hidden rounded-md border"
            style={{ backgroundColor: primaryColor }}
          >
            <input
              type="color"
              value={primaryColor}
              onChange={e => patchSection("theme", { primaryColor: e.target.value })}
              className="absolute inset-0 size-full cursor-pointer opacity-0"
              aria-label="Primary colour"
            />
          </label>
          <Input
            className={INPUT_CLASS}
            value={primaryColor}
            onChange={e => patchSection("theme", { primaryColor: e.target.value })}
            placeholder="#437dfc"
          />
        </div>
      </Field>
    </SectionCard>
  );
};
