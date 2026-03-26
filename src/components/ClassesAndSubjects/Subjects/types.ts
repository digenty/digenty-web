export type ClassItem = {
  classId?: number;
  armId?: number;
  classArmName: string;
  reportStatus: "NOT_SUBMITTED" | "IN_PROGRESS" | "SUBMITTED" | "REQUEST_EDIT_ACCESS";
};

export type SubjectProps = {
  subjectName?: string;
  classes: ClassItem[];
  subjectId?: number;
};
