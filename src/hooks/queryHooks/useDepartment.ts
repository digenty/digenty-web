import { getDepartmentsForASchool } from "@/api/department";
import { departmentKeys } from "@/queries/department";
import { useQuery } from "@tanstack/react-query";

export const useGetDepartments = () => {
  return useQuery({
    queryKey: departmentKeys.departments,
    queryFn: getDepartmentsForASchool,
  });
};
