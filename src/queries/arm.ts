export const armKeys = {
  all: ["arms"] as const,
  armsByClass: (armId?: number) => ["arms", armId] as const,
};
