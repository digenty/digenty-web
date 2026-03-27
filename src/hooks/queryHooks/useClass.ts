import {
  deleteClass,
  getClassCumulativeReport,
  getClasses,
  getClassesByLevel,
  getClassLevels,
  getClassReport,
  getClassTeachersInClass,
  getRequiredSubjectReport,
  getTeacherClass,
  requestEditAccess,
  setPromotionDecision,
  submitClassReport,
} from "@/api/class";
import { branchKeys } from "@/queries/branch";

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
    queryKey: [classKeys.classesByLevel, levelId],
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

export const useSubmitClassReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [classKeys.submitClassReport],
    mutationFn: (payload: { classArmReportId: number; status: string }) => submitClassReport(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [classKeys.classReport()] });
      queryClient.invalidateQueries({ queryKey: [branchKeys.branchDetail] });
    },
  });
};

export const useSetPromotionDecision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [classKeys.setPromotionDecision],
    mutationFn: (payload: {
      armId: number;
      sessionId: number;
      decisions: {
        studentId: number;
        status: string;
        toClassId?: number;
        toArmId?: number;
      }[];
    }) => setPromotionDecision(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [classKeys.classCumulativeReport()] });
    },
  });
};

export const useGetRequiredSubjectReport = (armId: number, isSubjectCombination: boolean) => {
  return useQuery({
    queryKey: classKeys.requiredSubjectReport(armId),
    queryFn: () => getRequiredSubjectReport(armId),
    enabled: isSubjectCombination,
  });
};
