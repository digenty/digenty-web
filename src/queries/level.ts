export const levelKeys = {
  levels: ["levels"] as const,
  updateLevel: ["updateLevel"] as const,
  resultSettings: (levelId: number, filter: string) => ["levelResultSettings", levelId, filter] as const,
  levelAssessments: ["levelAssessments"] as const,
  levelGradings: ["levelGradings"] as const,
  addLevel: ["addLevel"] as const,
  deleteLevel: ["deleteLevel"] as const,
};
