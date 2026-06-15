"use client";

import { BuildingFill } from "@digenty/icons";
import { Input } from "@/components/ui/input";
import { Field, INPUT_CLASS } from "../common";
import { useWebsiteCustomization } from "../context";
import { ImageUploadRow } from "../ImageUpload";
import { SectionCard } from "../SectionCard";

export const SchoolIdentitySection = () => {
  const { config, patchSection, fieldError, disabled } = useWebsiteCustomization();
  const { schoolIdentity } = config;

  return (
    <SectionCard icon={<BuildingFill fill="var(--color-icon-default)" />} title="School Identity" defaultOpen>
      <Field label="School Logo">
        <ImageUploadRow
          value={schoolIdentity.logoUrl}
          onChange={url => patchSection("schoolIdentity", { logoUrl: url })}
          hint="JPG or PNG. 1MB Max."
          type="logo"
          disabled={disabled}
        />
      </Field>

      <Field label="School Name" error={fieldError("schoolIdentity.name")}>
        <Input
          className={INPUT_CLASS}
          value={schoolIdentity.name}
          onChange={e => patchSection("schoolIdentity", { name: e.target.value })}
          placeholder="Input School Name"
          disabled={disabled}
        />
      </Field>

      <Field label="Motto">
        <Input
          className={INPUT_CLASS}
          value={schoolIdentity.motto}
          onChange={e => patchSection("schoolIdentity", { motto: e.target.value })}
          placeholder="Input Motto"
          disabled={disabled}
        />
      </Field>
    </SectionCard>
  );
};
