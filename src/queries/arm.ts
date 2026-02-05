export const armKeys = {
  all: ["arms"] as const,
  armsByClass: (classId?: number) => ["arms", classId] as const,
};
