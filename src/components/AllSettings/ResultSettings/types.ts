export interface CommentRow {
  id: string;
  minPercentage: string;
  maxPercentage: string;
  comment: string;
}

export interface LevelTab {
  levelName: string;
  levelIds: number[];
}

export interface LevelRowsState {
  [levelName: string]: CommentRow[];
}
