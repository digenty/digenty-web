import { addSubject, getBranchTeachersClassSubjects, getSubjectStudents, getTeacherSubjects, updateSubject } from "@/api/subject";
import { subjectKeys } from "@/queries/subject";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const useAddSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: subjectKeys.addSubject,
    mutationFn: addSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.mysubjects });
    },
  });
};
