import { addDepartmentsToLevel, getDepartmentsForASchool } from "@/api/department";
import { departmentKeys } from "@/queries/department";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetDepartments = () => {
  return useQuery({
    queryKey: departmentKeys.departments,
    queryFn: getDepartmentsForASchool,
  });
};
export const useAddDepartmentsToLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: departmentKeys.addDepartmentsToLevel,
    mutationFn: addDepartmentsToLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.departments });
    },
  });
};
