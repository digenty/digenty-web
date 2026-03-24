export const classKeys = {
  classes: ["classes"] as const,
  all: ["allTeacherClasses"] as const,
  class: (classId: number) => ["class", classId] as const,
  classReport: (armId?: number, termId?: number) => ["classReport", armId, termId] as const,
  classCumulativeReport: (armId?: number) => ["classCumulativeReport", armId] as const,
  classReportPromotion: (armId: number) => ["classReportPromotion", armId] as const,
  requestEditAccess: ["requestEditAccess"] as const,
  classesByLevel: (levelId?: number) => ["classesByLevel", levelId] as const,
  deleteClass: ["deleteClass"] as const,
  classLevel: ["classLevel"] as const,
};
