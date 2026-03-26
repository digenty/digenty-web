import { getBranchTeachersClassSubjects, getSubjectStudents, getTeacherSubjects } from "@/api/subject";
import { subjectKeys } from "@/queries/subject";
import { useQuery } from "@tanstack/react-query";

export const useGetTeacherSubjects = () => {
  return useQuery({
    queryKey: subjectKeys.mysubjects,
    queryFn: () => getTeacherSubjects(),
    retry: false,
  });
};

export const useGetSubjectStudents = (subjectId: number, amrId: number) => {
  return useQuery({
    queryKey: subjectKeys.studentsBySubjectClass(subjectId, amrId),
    queryFn: () => getSubjectStudents(subjectId, amrId),
    retry: false,
  });
};

export const useGetBranchTeachersClassSubjects = (armId: number) => {
  return useQuery({
    queryKey: subjectKeys.mysubjects,
    queryFn: () => getBranchTeachersClassSubjects(armId),
    retry: false,
  });
};
