import { getClassesForASchool } from "@/api/class";
import { classKeys } from "@/queries/class";
import { useQuery } from "@tanstack/react-query";

export const useGetClasses = () => {
  return useQuery({
    queryKey: classKeys.classes,
    queryFn: getClassesForASchool,
  });
};
