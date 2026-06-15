"use client";

import { DeleteBin, GraduationCap } from "@digenty/icons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AddButton, Field, INPUT_CLASS, SquareIconButton } from "../common";
import { useWebsiteCustomization } from "../context";
import { SectionCard } from "../SectionCard";
import { uid } from "../defaults";
import { AdmissionClass, ROUTING_OPTIONS } from "../types";

export const AdmissionsSection = () => {
  const { config, patchSection, setSection, disabled } = useWebsiteCustomization();
  const { admissions } = config;

  const updateClasses = (classes: AdmissionClass[]) => setSection("admissions", { ...admissions, classes });
  const updateClass = (id: string, patch: Partial<AdmissionClass>) =>
    updateClasses(admissions.classes.map(row => (row.id === id ? { ...row, ...patch } : row)));

  return (
    <SectionCard
      icon={<GraduationCap fill="var(--color-icon-default)" />}
      title="Admissions"
      visible={admissions.visible}
      onVisibleChange={value => patchSection("admissions", { visible: value })}
      disabled={disabled}
    >
      <Field label="Section Title">
        <Input
          className={INPUT_CLASS}
          value={admissions.title}
          onChange={e => patchSection("admissions", { title: e.target.value })}
          placeholder="e.g Admissions"
          disabled={disabled}
        />
      </Field>

      <Field label="Admission Description">
        <Textarea
          className={cn(INPUT_CLASS, "min-h-24 resize-none px-3 py-2")}
          value={admissions.description}
          onChange={e => patchSection("admissions", { description: e.target.value })}
          placeholder="Talk about your school"
          disabled={disabled}
        />
      </Field>

      <Field label="Requirements" hint="Optional">
        <Input
          className={INPUT_CLASS}
          value={admissions.requirements}
          onChange={e => patchSection("admissions", { requirements: e.target.value })}
          placeholder="e.g Birth certificate, Common Entrance"
          disabled={disabled}
        />
        <span className="text-text-muted text-xs">Enter requirements separated by commas</span>
      </Field>

      <Field label="Classes" hint="Optional">
        <div className="flex flex-col gap-2">
          <div className="text-text-muted flex items-center gap-3 text-xs font-medium">
            <span className="flex-1">Class</span>
            <span className="flex-1">Age Range</span>
            <span className="flex-1">Spots Available</span>
            {!disabled && <span className="size-9 shrink-0" />}
          </div>
          {admissions.classes.map(row => (
            <div key={row.id} className="flex items-center gap-3">
              <Input
                className={cn(INPUT_CLASS, "flex-1")}
                value={row.name}
                onChange={e => updateClass(row.id, { name: e.target.value })}
                placeholder="e.g Nursery 1"
                disabled={disabled}
              />
              <Input
                className={cn(INPUT_CLASS, "flex-1")}
                value={row.ageRange}
                onChange={e => updateClass(row.id, { ageRange: e.target.value })}
                placeholder="e.g 2 - 4 years"
                disabled={disabled}
              />
              <Input
                className={cn(INPUT_CLASS, "flex-1")}
                value={row.spots}
                onChange={e => updateClass(row.id, { spots: e.target.value })}
                placeholder="e.g 30"
                disabled={disabled}
              />
              {!disabled && (
                <SquareIconButton onClick={() => updateClasses(admissions.classes.filter(r => r.id !== row.id))} aria-label="Remove class">
                  <DeleteBin fill="var(--color-icon-default-muted)" className="size-4" />
                </SquareIconButton>
              )}
            </div>
          ))}
          {!disabled && (
            <AddButton
              label="Add Row"
              onClick={() => updateClasses([...admissions.classes, { id: uid("class"), name: "", ageRange: "", spots: "" }])}
            />
          )}
        </div>
      </Field>

      <div className="flex gap-4">
        <Field label="Button Text" hint="Optional" className="flex-1">
          <Input
            className={INPUT_CLASS}
            value={admissions.buttonText}
            onChange={e => patchSection("admissions", { buttonText: e.target.value })}
            placeholder="e.g Apply for Admission"
            disabled={disabled}
          />
        </Field>
        <Field label="Button Link" hint="Optional" className="flex-1">
          <Select value={admissions.buttonLink} onValueChange={value => patchSection("admissions", { buttonLink: value })} disabled={disabled}>
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
