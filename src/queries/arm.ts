export const armKeys = {
  all: ["arms"] as const,
  armsByClass: (classId: string) => ["arms", classId] as const,
};
