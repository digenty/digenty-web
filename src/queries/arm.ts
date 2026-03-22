import { LevelType } from "@/api/types";

export const armKeys = {
  all: ["arms"] as const,
  armsByClass: (armId?: number) => ["arms", armId] as const,
  armsByLevel: (levelType?: LevelType, branchId?: number) => ["armsByLevel", levelType, branchId] as const,
  deleteArm: ["deleteArm"] as const,
  addArm: ["addArm"] as const,
};
