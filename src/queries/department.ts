export const departmentKeys = {
  departments: ["departments"] as const,
  departmentsByLevel: (levelType?: string, branchId?: number) => ["departmentsByLevel", levelType, branchId] as const,
  addDepartmentsToLevel: ["addDepartmentsToLevel"] as const,
  deleteDepartment: ["deleteDepartment"] as const,
  createDepartmentSubjects: ["createDepartmentSubjects"] as const,
  departmentsByClass: (className?: string, levelType?: string, branchId?: number) => ["departmentsByClass", className, levelType, branchId] as const,
  departmentSubjectsByLevel: (departmentId?: number, levelId?: number) => ["departmentSubjectsByLevel", departmentId, levelId] as const,
  departmentSubjectsByClass: ["departmentSubjectsByClass"] as const,
};
