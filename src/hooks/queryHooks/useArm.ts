import { getArmsByClass } from "@/api/arm";
import { armKeys } from "@/queries/arm";
import { useQuery } from "@tanstack/react-query";

export const useGetArmsByClass = (classId?: number) => {
  return useQuery({
    queryKey: armKeys.armsByClass(classId),
    queryFn: () => getArmsByClass(classId),
    enabled: !!classId,
  });
};
