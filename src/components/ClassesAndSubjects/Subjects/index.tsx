import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import Subject from "./Subject";
import SubjectHeader from "./SubjectHeader";

import { Skeleton } from "@/components/ui/skeleton";

type ClassSubjectMainProps = {
  subjectName: string;
  subjectId: number;
  classArmReportDtos: [];
};

type ClassTeacherSubjectProps = {
  subjectList: ClassSubjectMainProps[];
  isLoading: boolean;
};

export const Subjects = ({ subjectList, isLoading }: ClassTeacherSubjectProps) => {
  useBreadcrumb([
    { label: "Classes and Subjects", url: "/classes-and-subjects" },
    { label: "My Subjects", url: "/classes-and-subjects?tab=subjects" },
  ]);

  return (
    <div className="space-y-4 pb-10">
      <SubjectHeader />
      {isLoading ? (
        <div className="flex flex-col gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="bg-bg-input-soft h-30 w-full md:max-w-219" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {subjectList.map(subject => (
            <Subject key={subject.subjectId} subjectName={subject.subjectName} classes={subject.classArmReportDtos} subjectId={subject.subjectId} />
          ))}
        </div>
      )}
    </div>
  );
};
