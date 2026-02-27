export const staffKeys = {
  staffs: ["staffs"] as const,
  addStaff: ["addStaff"] as const,
  staffDetails: (staffId: number | null) => ["staffDetails", staffId] as const,
  deleteStaff: ["deleteStaff"] as const,
  deactivateStaff: ["deactivateStaff"] as const,
};
