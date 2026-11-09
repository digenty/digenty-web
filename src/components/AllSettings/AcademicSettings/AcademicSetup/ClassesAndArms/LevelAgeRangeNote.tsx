import { AlertFill } from "@digenty/icons";
import { LevelType } from "@/api/types";

const AGE_RANGE_BY_LEVEL_TYPE: Partial<Record<LevelType, { label: string; range: string }>> = {
  CRECHE: { label: "Creche", range: "0–2 years" },
  NURSERY: { label: "Nursery", range: "2–4 years" },
  KINDERGARTEN: { label: "Kindergarten", range: "4–6 years" },
};

export const LevelAgeRangeNote = ({ levelType }: { levelType?: LevelType }) => {
  if (!levelType) return null;
  const ageRange = AGE_RANGE_BY_LEVEL_TYPE[levelType];
  if (!ageRange) return null;

  return (
    <div className="bg-bg-subtle border-border-default mt-4 flex items-start gap-2 rounded-md border p-3">
      <AlertFill fill="var(--color-icon-default-muted)" className="mt-0.5 size-4 shrink-0" />
      <div className="text-text-subtle text-xs leading-relaxed">
        <span className="text-text-default font-medium">{ageRange.label}</span> is typically for children aged{" "}
        <span className="text-text-default font-medium">{ageRange.range}</span>.
      </div>
    </div>
  );
};
