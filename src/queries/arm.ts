import { LevelType } from "@/api/types";

export const armKeys = {
  all: ["arms"] as const,
  armsByClass: (classId: number | null) => ["arms", classId] as const,
  armsByLevel: (levelType?: LevelType, branchId?: number) => ["armsByLevel", levelType, branchId] as const,
  deleteArm: ["deleteArm"] as const,
  addArm: ["addArm"] as const,
  addArmToClass: (classId?: number) => ["addArmToClass", classId] as const,
};
