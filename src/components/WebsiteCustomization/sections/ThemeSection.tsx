"use client";

import { ColorFilter } from "@digenty/icons";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Field, INPUT_CLASS } from "../common";
import { useWebsiteCustomization } from "../context";
import { SectionCard } from "../SectionCard";

export const ThemeSection = () => {
  const { config, patchSection, fieldError, disabled } = useWebsiteCustomization();
  const { primaryColor } = config.theme;

  return (
    <SectionCard icon={<ColorFilter fill="var(--color-icon-default)" />} title="Theme">
      <Field label="Primary Colour" error={fieldError("theme.primaryColor")}>
        <div className="flex items-center gap-3">
          <label
            className={cn(
              "border-border-default relative h-9 w-14 shrink-0 overflow-hidden rounded-md border",
              disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
            )}
            style={{ backgroundColor: primaryColor }}
          >
            <input
              type="color"
              value={primaryColor}
              onChange={e => patchSection("theme", { primaryColor: e.target.value })}
              className="absolute inset-0 size-full cursor-pointer opacity-0"
              aria-label="Primary colour"
              disabled={disabled}
            />
          </label>
          <Input
            className={INPUT_CLASS}
            value={primaryColor}
            onChange={e => patchSection("theme", { primaryColor: e.target.value })}
            placeholder="#437dfc"
            disabled={disabled}
          />
        </div>
      </Field>
    </SectionCard>
  );
};
