import {
  addSubject,
  deleteSubjectByLevel,
  getBranchTeachersClassSubjects,
  getSubjectsByLevel,
  getSubjectStudents,
  getTeacherSubjects,
} from "@/api/subject";
import { LevelType } from "@/api/types";
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
    queryKey: [subjectKeys.studentsBySubjectClass, subjectId, amrId],
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

export const useGetSubjectsByLevel = (levelType?: LevelType, branchId?: number) => {
  return useQuery({
    queryKey: subjectKeys.subjectsByLevel(levelType, branchId),
    queryFn: () => getSubjectsByLevel(levelType, branchId),
    enabled: !!levelType,
    retry: false,
  });
};

export const useAddSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: subjectKeys.addSubject,
    mutationFn: addSubject,
    // onSuccess: (_data, variables) => {
    //   queryClient.invalidateQueries({
    //     queryKey: subjectKeys.subjectsByLevel(variables.levelId, variables.branchId),
    //   });
    // },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: subjectKeys.deleteSubject,
    mutationFn: ({ subjectId, levelId }: { subjectId: number; levelId: number }) => deleteSubjectByLevel(subjectId, levelId),
    // onSuccess: (_data, variables) => {
    //   queryClient.invalidateQueries({
    //     queryKey: subjectKeys.subjectsByLevel(variables.levelId),
    //   });
    // },
  });
};
