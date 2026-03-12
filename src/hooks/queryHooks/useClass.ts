import {
  deleteClass,
  getClassCumulativeReport,
  getClasses,
  getClassesByLevel,
  getClassLevels,
  getClassReport,
  getClassTeachersInClass,
  getTeacherClass,
  requestEditAccess,
} from "@/api/class";
import { classKeys } from "@/queries/class";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetClasses = (branchId?: number) => {
  return useQuery({
    queryKey: [classKeys.classes, branchId],
    queryFn: () => getClasses(branchId),
  });
};

export const useGetTeacherClasses = () => {
  return useQuery({
    queryKey: classKeys.all,
    queryFn: () => getTeacherClass(),
    retry: false,
  });
};

// To put in another branch
export const useGetClassTeachersInClass = (armId: number) => {
  return useQuery({
    queryKey: classKeys.class(armId),
    queryFn: () => getClassTeachersInClass(armId),
    retry: false,
  });
};

export const useGetClassReport = (armId?: number, termId?: number) => {
  return useQuery({
    queryKey: classKeys.classReport(armId, termId),
    queryFn: () => getClassReport(armId, termId),
    enabled: !!armId && !!termId,
  });
};

export const useGetClassCumulativeReport = (armId?: number, filter?: string) => {
  return useQuery({
    queryKey: classKeys.classCumulativeReport(armId),
    queryFn: () => getClassCumulativeReport(armId),
    enabled: !!armId && filter === "promotion",
  });
};

export const useRequestEditAccess = () => {
  return useMutation({
    mutationKey: classKeys.requestEditAccess,
    mutationFn: requestEditAccess,
  });
};

export const useGetClassesByLevel = (levelId?: number) => {
  return useQuery({
    queryKey: classKeys.classesByLevel(levelId),
    queryFn: () => getClassesByLevel(levelId),
    enabled: !!levelId,
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: classKeys.deleteClass,
    mutationFn: (classroomId: number) => deleteClass(classroomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [classKeys.classesByLevel] });
    },
    });
};

export const useGetClassLevel = () => {
  return useQuery({
    queryKey: classKeys.classLevel,
    queryFn: getClassLevels,
  });
};
