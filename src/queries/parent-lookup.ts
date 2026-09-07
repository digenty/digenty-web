export const parentLookupKeys = {
  activeTerm: () => ["parentPortalActiveTerm"] as const,
  terms: (academicSessionId?: number) => ["parentPortalTerms", academicSessionId] as const,
  branches: (schoolId?: number) => ["parentPortalBranches", schoolId] as const,
  classes: (schoolId?: number, branchId?: number) => ["parentPortalClasses", schoolId, branchId] as const,
  arms: (classId?: number) => ["parentPortalArms", classId] as const,
};
