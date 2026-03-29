import { addDepartmentsToLevel, deleteDepartmentFromLevel, getDepartmentsByLevel, getDepartmentsForASchool } from "@/api/department";
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
    },
  });
};
