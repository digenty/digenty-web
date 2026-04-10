import {
  addDepartmentsToLevel,
  assignArmToDepartment,
  createDepartmentSubjects,
  deleteArmDepartmentSubjects,
  deleteDepartmentFromLevel,
  deleteDepartmentSubjects,
  getDepartmentSubjectsByClass,
  getDepartmentSubjectsByLevel,
  getDepartmentsByClass,
  getDepartmentsByLevel,
  getDepartmentsForASchool,
} from "@/api/department";
import { classKeys } from "@/queries/class";
import { departmentKeys } from "@/queries/department";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetDepartments = () => {
  return useQuery({
    queryKey: departmentKeys.departments,
    queryFn: getDepartmentsForASchool,
  });
};

export const useGetDepartmentsByLevel = (levelType?: string, branchId?: number) => {
  return useQuery({
    queryKey: departmentKeys.departmentsByLevel(levelType, branchId),
    queryFn: () => getDepartmentsByLevel(levelType, branchId),
    enabled: !!levelType,
  });
};
export const useAddDepartmentsToLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: departmentKeys.addDepartmentsToLevel,
    mutationFn: addDepartmentsToLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.departments });
      queryClient.invalidateQueries({ queryKey: ["departmentsByLevel"] });
      queryClient.invalidateQueries({ queryKey: [classKeys.classesByLevel] });
    },
  });
};

export const useDeleteDepartmentFromLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: departmentKeys.deleteDepartment,
    mutationFn: ({ departmentId, levelId }: { departmentId: number; levelId: number }) => deleteDepartmentFromLevel(departmentId, levelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.departments });
      queryClient.invalidateQueries({ queryKey: ["departmentsByLevel"] });
      queryClient.invalidateQueries({ queryKey: [classKeys.classesByLevel] });
    },
  });
};

export const useCreateDepartmentSubjects = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: departmentKeys.createDepartmentSubjects,
    mutationFn: createDepartmentSubjects,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.departments });
      queryClient.invalidateQueries({ queryKey: [departmentKeys.departmentSubjectsByClass] });
      queryClient.invalidateQueries({ queryKey: [departmentKeys.departmentSubjectsByLevel] });
    },
  });
};

export const useDeleteDepartmentSubjects = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: departmentKeys.deleteDepartmentSubjects,
    mutationFn: ({ departmentId, subjectId }: { departmentId: number; subjectId: number }) => deleteDepartmentSubjects(departmentId, subjectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.departments });
      queryClient.invalidateQueries({ queryKey: [departmentKeys.departmentSubjectsByClass] });
    },
  });
};

export const useGetDepartmentSubjectsByLevel = (departmentId?: number, levelId?: number) => {
  return useQuery({
    queryKey: [departmentKeys.departmentSubjectsByLevel, departmentId, levelId],
    queryFn: () => getDepartmentSubjectsByLevel(departmentId!, levelId!),
    enabled: !!departmentId && !!levelId,
  });
};

export const useGetDepartmentSubjectsByClass = (departmentId?: number, classId?: number) => {
  return useQuery({
    queryKey: [departmentKeys.departmentSubjectsByClass, departmentId, classId],
    queryFn: () => getDepartmentSubjectsByClass(departmentId!, classId!),
    enabled: !!departmentId && !!classId,
  });
};

export const useGetDepartmentsByClass = (className?: string, levelType?: string, branchId?: number) => {
  return useQuery({
    queryKey: departmentKeys.departmentsByClass(className, levelType, branchId),
    queryFn: () => getDepartmentsByClass(className, levelType, branchId),
    enabled: !!className && !!levelType,
  });
};

export const useAssignArmToDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: departmentKeys.assignArmToDepartment,
    mutationFn: assignArmToDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.departments });
      // queryClient.invalidateQueries({ queryKey: [classKeys.classesByLevel] });
      queryClient.invalidateQueries({ queryKey: ["armsByClass"] });
    },
  });
};
