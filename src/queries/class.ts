export const classKeys = {
  classes: ["classes"] as const,
  all: ["allTeacherClasses"] as const,
  class: (classId: number) => ["class", classId] as const,
};
