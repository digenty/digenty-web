export const armKeys = {
  all: ["arms"] as const,
  armsByClass: (armId?: number) => ["arms", armId] as const,
  armsByLevel: (levelId?: number, branchId?: number) => ["armsByLevel", levelId, branchId] as const,
};
