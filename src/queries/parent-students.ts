export const parentStudentsKeys = {
  all: ["parentPortalStudents"] as const,
  overview: (studentId?: number) => ["parentPortalStudentOverview", studentId] as const,
  academicRecord: (studentId?: number, termId?: number) => ["parentPortalStudentAcademicRecord", studentId, termId] as const,
};
