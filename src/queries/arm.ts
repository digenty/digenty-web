export const armKeys = {
  all: ["arms"] as const,
  armsByClass: (classId: string | null) => ["arms", classId] as const,
};
