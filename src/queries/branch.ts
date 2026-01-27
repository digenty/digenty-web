export const branchKeys = {
  branches: ["branches"] as const,
  branchBySchool: (id: string) => ["branches", id] as const,
};
