export const midtermSettingsKeys = {
  all: ["midterm-settings"] as const,
  list: (branchId?: number) => ["midterm-settings", "list", branchId] as const,
  level: (levelId?: number) => ["midterm-settings", "level", levelId] as const,
  comments: (armId?: number, termId?: number) => ["midterm", "comments", armId, termId] as const,
  setLevelFormat: ["setLevelMidtermFormat"] as const,
  setClassFormat: ["setClassMidtermFormat"] as const,
  resetClassFormat: ["resetClassMidtermFormat"] as const,
  saveComments: ["saveMidtermComments"] as const,
};
