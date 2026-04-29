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
export type PromotionType = "PROMOTE_ALL" | "MANUAL" | "BY_PERFORMANCE" | "SUBJECT_COMBINATION";

export const defaultFormState = (isSeniorSecondary = false): LevelFormState => ({
  calculationMethod: undefined,
  promotionType: undefined,
  minimumOverallPercentage: "",
  minimumPassGrade: "",
  requiredSubjectIds: isSeniorSecondary ? {} : [],
  subjectCombinationMinPercentage: "",
});

export interface LevelFormState {
  calculationMethod: "THIRD_TERM_ONLY" | "CUMULATIVE" | undefined;
  promotionType: PromotionType | undefined;
  minimumOverallPercentage: string;
  minimumPassGrade: string;
  requiredSubjectIds: Record<number, number[]> | number[];
  subjectCombinationMinPercentage: string;
}
export interface LevelFormProps {
  levelType: LevelType;
  levelId: number;
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
