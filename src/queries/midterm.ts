import { MidtermFormat } from "@/api/types";

export const midtermKeys = {
  all: ["midterm"] as const,
  studentReport: (studentId?: number, armId?: number, termId?: number, view?: MidtermFormat) =>
    ["midterm", "student", studentId, armId, termId, view] as const,
  classOverview: (armId?: number, termId?: number, view?: MidtermFormat) => ["midterm", "arm", armId, termId, view] as const,
  publish: ["publishMidtermReport"] as const,
  unpublish: ["unpublishMidtermReport"] as const,
  parentReport: (studentId?: number, termId?: number) => ["midterm", "parent", studentId, termId] as const,
};
