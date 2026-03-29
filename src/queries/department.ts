export const departmentKeys = {
  departments: ["departments"] as const,
  departmentsByLevel: (levelType?: string, branchId?: number) => ["departmentsByLevel", levelType, branchId] as const,
  addDepartmentsToLevel: ["addDepartmentsToLevel"] as const,
  deleteDepartment: ["deleteDepartment"] as const,
};
