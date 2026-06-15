"use client";

import { DeleteBin, Information } from "@digenty/icons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AddButton, Field, INPUT_CLASS, SquareIconButton } from "../common";
import { useWebsiteCustomization } from "../context";
import { SectionCard } from "../SectionCard";
import { uid } from "../defaults";
import { KeyStat } from "../types";

export const AboutSection = () => {
  const { config, patchSection, setSection, disabled } = useWebsiteCustomization();
  const { about } = config;

  const updateStats = (stats: KeyStat[]) => setSection("about", { ...about, stats });
  const updateStat = (id: string, patch: Partial<KeyStat>) => updateStats(about.stats.map(stat => (stat.id === id ? { ...stat, ...patch } : stat)));

  return (
    <SectionCard
      icon={<Information fill="var(--color-icon-default)" />}
      title="About Us"
      visible={about.visible}
      onVisibleChange={value => patchSection("about", { visible: value })}
      disabled={disabled}
    >
      <Field label="Section Title">
        <Input
          className={INPUT_CLASS}
          value={about.title}
          onChange={e => patchSection("about", { title: e.target.value })}
          placeholder="e.g About Us"
          disabled={disabled}
        />
      </Field>

      <Field label="About Text">
        <Textarea
          className={cn(INPUT_CLASS, "min-h-24 resize-none px-3 py-2")}
          value={about.text}
          onChange={e => patchSection("about", { text: e.target.value })}
          placeholder="Talk about your school"
          disabled={disabled}
        />
      </Field>

      <Field label="Key Stats" hint="Optional">
        <div className="flex flex-col gap-3">
          {about.stats.map(stat => (
            <div key={stat.id} className="flex items-center gap-3">
              <Input
                className={cn(INPUT_CLASS, "flex-1")}
                value={stat.value}
                onChange={e => updateStat(stat.id, { value: e.target.value })}
                placeholder="e.g 25+"
                disabled={disabled}
              />
              <Input
                className={cn(INPUT_CLASS, "flex-1")}
                value={stat.label}
                onChange={e => updateStat(stat.id, { label: e.target.value })}
                placeholder="e.g Years of Excellence"
                disabled={disabled}
              />
              {!disabled && (
                <SquareIconButton onClick={() => updateStats(about.stats.filter(s => s.id !== stat.id))} aria-label="Remove stat">
                  <DeleteBin fill="var(--color-icon-default-muted)" className="size-4" />
                </SquareIconButton>
              )}
            </div>
          ))}
          {!disabled && <AddButton label="Add Stats" onClick={() => updateStats([...about.stats, { id: uid("stat"), value: "", label: "" }])} />}
        </div>
      </Field>
    </SectionCard>
  );
};
