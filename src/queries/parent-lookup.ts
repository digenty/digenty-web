export const parentLookupKeys = {
  terms: (schoolId?: number, academicSessionId?: number) => ["parentPortalTerms", schoolId, academicSessionId] as const,
  branches: (schoolId?: number) => ["parentPortalBranches", schoolId] as const,
  classes: (schoolId?: number, branchId?: number) => ["parentPortalClasses", schoolId, branchId] as const,
  arms: (classId?: number) => ["parentPortalArms", classId] as const,
};
