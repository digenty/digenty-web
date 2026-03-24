import { LevelType } from "@/api/types";

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

export type CalculationMethod = "THIRD_TERM_ONLY" | "CUMULATIVE";
export type PromotionType = "PROMOTE_ALL" | "MANUAL" | "BY_PERFORMANCE";

export interface LevelFormState {
  calculationMethod: CalculationMethod | null;
  promotionType: PromotionType | null;
  minimumOverallPercentage: string;
  subjectCombinationMinPercentage: string;
  minimumPassGrade: string;
  requiredSubjectIds: number[];
}

export const defaultFormState = (): LevelFormState => ({
  calculationMethod: null,
  promotionType: null,
  minimumOverallPercentage: "",
  subjectCombinationMinPercentage: "",
  minimumPassGrade: "",
  requiredSubjectIds: [],
});
export interface LevelFormProps {
  levelType: LevelType;
  academicSessionId: number;
  formState: LevelFormState;
  onChange: (updates: Partial<LevelFormState>) => void;
  onSave: () => void;
  onCancel: () => void;
  isPending: boolean;
}

export interface CommentViewProps {
  rows: { id: number; minPercentage: number; maxPercentage: number; comment: string }[];
}
