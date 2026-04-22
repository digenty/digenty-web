import {
  addSubject,
  addSubjectToClass,
  assignSubjectTeacher,
  deleteSubjectByLevel,
  deleteSubjectFromClass,
  getAllSubjects,
  getBranchTeachersClassSubjects,
  getSubjectsByClassAndLevel,
  getSubjectsByClassId,
  getSubjectsByLevel,
  getSubjectStudents,
  getTeacherSubjects,
  updateAssignSubjectTeacher,
} from "@/api/subject";
import { LevelType } from "@/api/types";
import { classKeys } from "@/queries/class";
import { subjectKeys } from "@/queries/subject";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetTeacherSubjects = () => {
  return useQuery({
    queryKey: [subjectKeys.mysubjects],
    queryFn: () => getTeacherSubjects(),
    retry: false,
  });
};

export const useGetAllSubjects = () => {
  return useQuery({
    queryKey: subjectKeys.allSubjects,
    queryFn: () => getAllSubjects(),
    retry: false,
  });
};

export const useAssignSubjectTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [subjectKeys.assignSubjectTeacher],
    mutationFn: assignSubjectTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branchDetail"] });
    },
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

export const useGetSubjectsByClass = (className?: string, levelType?: string, branchId?: number) => {
  return useQuery({
    queryKey: subjectKeys.subjectsByClass(className, levelType, branchId),
    queryFn: () => getSubjectsByClassAndLevel(className, levelType, branchId),
    enabled: !!className && !!levelType,
    retry: false,
  });
};

export const useGetSubjectsByClassId = (classId: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [subjectKeys.subjectsByClassId, classId],
    queryFn: () => getSubjectsByClassId(classId),
    enabled: options?.enabled !== undefined ? options.enabled && !!classId : !!classId,
    retry: false,
  });
};

export const useAddSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: subjectKeys.addSubject,
    mutationFn: addSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [classKeys.classesByLevel],
      });
    },
  });
};

export const useAddSubjectToClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: subjectKeys.addSubjectToClass,
    mutationFn: addSubjectToClass,
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["subjectsByLevel"] });
      queryClient.invalidateQueries({ queryKey: ["subjectsByClass"] });
      queryClient.invalidateQueries({ queryKey: [classKeys.classesByLevel] });
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: subjectKeys.deleteSubject,
    mutationFn: ({ subjectId, levelId }: { subjectId: number; levelId: number }) => deleteSubjectByLevel(subjectId, levelId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [classKeys.classesByLevel],
      });
    },
  });
};
export const useDeleteSubjectFromClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: subjectKeys.deleteSubject,
    mutationFn: ({ subjectId, classId }: { subjectId: number; classId: number }) => deleteSubjectFromClass(subjectId, classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjectsByClass"] });
    },
  });
};

export const useUpdateAssignSubjectTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: subjectKeys.updateTeacherSubjectAssignment,
    mutationFn: (payload: { teacherId: number; subjectArmAndClassDtos: { subjectId: number; armId: number }[] }) =>
      updateAssignSubjectTeacher(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [subjectKeys.updateTeacherSubjectAssignment] });
    },
  });
};
