export const classKeys = {
  classes: ["classes"] as const,
  all: ["allTeacherClasses"] as const,
  class: (classId: number) => ["class", classId] as const,
  classDetail: (branchId: number, termId: number) => ["allClassesDetails", branchId, termId] as const,
};
