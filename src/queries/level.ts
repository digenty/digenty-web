export const levelKeys = {
  levels: ["levels"] as const,
  updateLevel: ["updateLevel"] as const,
  resultSettings: (levelId: number, filter: string) => ["levelResultSettings", levelId, filter] as const,
  levelAssessments: (levelId: number) => ["levelAssessments", levelId] as const,
  levelGradings: (levelId: number) => ["levelGradings", levelId] as const,
};
