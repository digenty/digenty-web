export const midtermKeys = {
  all: ["midterm"] as const,
  studentReport: (studentId?: number, armId?: number, termId?: number) => ["midterm", "student", studentId, armId, termId] as const,
  classOverview: (armId?: number, termId?: number) => ["midterm", "arm", armId, termId] as const,
  publish: ["publishMidtermReport"] as const,
  unpublish: ["unpublishMidtermReport"] as const,
  parentReport: (studentId?: number, termId?: number) => ["midterm", "parent", studentId, termId] as const,
};
