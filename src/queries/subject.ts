export const subjectKeys = {
  mysubjects: ["subjects"] as const,
  studentsBySubjectClass: (subjectId: number, amrId: number) => [subjectId, amrId, "students"] as const,
};

export const REPORT_STATUS_CONFIG = {
  NOT_SUBMITTED: {
    label: "Not started",
    className: "bg-bg-badge-default text-text-subtle",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-bg-badge-orange text-bg-basic-orange-strong",
  },
  SUBMITTED: {
    label: "Submitted",
    className: "bg-bg-badge-green text-bg-basic-green-strong",
  },
  REQUEST_EDIT_ACCESS: {
    label: "Edit Requested",
    className: "bg-bg-badge-orange text-bg-basic-orange-strong",
  },
} as const;
