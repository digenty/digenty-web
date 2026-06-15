"use client";

import { Copyright } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Field, INPUT_CLASS } from "../common";
import { useWebsiteCustomization } from "../context";
import { SectionCard } from "../SectionCard";

export const FooterSection = () => {
  const { config, patchSection, disabled } = useWebsiteCustomization();
  const { footer } = config;

  return (
    <SectionCard
      icon={<Copyright className="text-icon-default size-5" />}
      title="Footer"
      visible={footer.visible}
      onVisibleChange={value => patchSection("footer", { visible: value })}
      disabled={disabled}
    >
      <Field label="Footer Text">
        <Input
          className={INPUT_CLASS}
          value={footer.text}
          onChange={e => patchSection("footer", { text: e.target.value })}
          placeholder="e.g Digenty Academy"
          disabled={disabled}
        />
      </Field>
    </SectionCard>
  );
};
