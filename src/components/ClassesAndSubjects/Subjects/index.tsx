import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import Subject from "./Subject";
import SubjectHeader from "./SubjectHeader";
import { useGetTeacherSubjects } from "@/hooks/queryHooks/useSubject";
import { Skeleton } from "@/components/ui/skeleton";

export const Subjects = () => {
  useBreadcrumb([
    { label: "Classes and Subjects", url: "/classes-and-subjects" },
    { label: "My Subjects", url: "/classes-and-subjects?tab=subjects" },
  ]);
  const { data: subjectList, isLoading } = useGetTeacherSubjects();

  return (
    <div className="space-y-4 pb-10">
      <SubjectHeader />
      {isLoading ? (
        <div className="flex flex-col gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="bg-bg-input-soft h-40 w-full" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {subjectList.map((subject: { subjectName: string; classArmReportDtos: [] }) => (
            <Subject key={subject.subjectName} subjectName={subject.subjectName} classes={subject.classArmReportDtos} />
          ))}
        </div>
      )}
    </div>
  );
};
