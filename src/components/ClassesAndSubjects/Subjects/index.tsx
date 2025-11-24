import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import Subject, { ClassItem } from "./Subject";
import SubjectHeader from "./SubjectHeader";

const mathClasses: ClassItem[] = [
  { id: 0, grade: "JSS 1A", subjectStatus: "Not Started" },
  { id: 1, grade: "JSS 2A", subjectStatus: "In Progress" },
  { id: 2, grade: "JSS 3A", subjectStatus: "Submitted" },
  { id: 3, grade: "SS 1A", subjectStatus: "Request Edit Access" },
  { id: 4, grade: "SS 2A", subjectStatus: "Submitted" },
  { id: 5, grade: "SS 3A", subjectStatus: "Submitted" },
];

export const Subjects = () => {
  useBreadcrumb([
    { label: "Classes and Subjects", url: "/classes-and-subjects" },
    { label: "My Subjects", url: "/classes-and-subjects?tab=subjects" },
  ]);
  return (
    <div className="space-y-4 pb-10">
      <SubjectHeader />
      <div className="flex flex-col gap-6">
        <Subject title="Mathematics" classes={mathClasses} />
        <Subject title="English" classes={mathClasses} />
        <Subject title="Yoruba" classes={mathClasses} />
      </div>
    </div>
  );
};
