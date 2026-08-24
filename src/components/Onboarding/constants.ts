export const schoolSizes = [
  { label: "1 - 200", value: "SMALL" },
  { label: "201 - 400", value: "MEDIUM" },
  { label: "400+", value: "LARGE" },
];

export const getSetupProgressBarClass = (percentage: number) => {
  if (percentage <= 30) return "bg-bg-basic-red-accent";
  if (percentage <= 70) return "bg-bg-basic-orange-accent";
  return "bg-bg-basic-green-accent";
};

export const getSetupProgressStrokeColor = (percentage: number) => {
  if (percentage <= 30) return "var(--color-bg-basic-red-accent)";
  if (percentage <= 70) return "var(--color-bg-basic-orange-accent)";
  return "var(--color-bg-basic-green-accent)";
};
