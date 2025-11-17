import Subject, { ClassItem } from "./Subject";
import SubjectdHeader from "./SubjectHeader";

const mathClasses: ClassItem[] = [
  { id: 0, grade: "JSS 1A", subjectStatus: "Not Started" },
  { id: 1, grade: "JSS 1A", subjectStatus: "In Progress" },
  { id: 2, grade: "JSS 1A", subjectStatus: "Submitted" },
  { id: 3, grade: "JSS 1A", subjectStatus: "Request Edit Access" },
  { id: 4, grade: "JSS 1A", subjectStatus: "Submitted" },
];

export default function SubjectsSection() {
  return (
    <div className="flex flex-col gap-6">
      <SubjectdHeader />
      <Subject title="Mathematics" classes={mathClasses} />
      <Subject title="Mathematics" classes={mathClasses} />
    </div>
  );
}
