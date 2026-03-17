import { getArmsByClass, getArmsByLevel } from "@/api/arm";
import { armKeys } from "@/queries/arm";
import { useQuery } from "@tanstack/react-query";

export const useGetArmsByClass = (classId?: number) => {
  return useQuery({
    queryKey: armKeys.armsByClass(classId),
    queryFn: () => getArmsByClass(classId),
    enabled: !!classId,
  });
};

export const useGetArmsByLevel = (levelId?: number, branchId?: number) => {
  return useQuery({
    queryKey: armKeys.armsByLevel(levelId, branchId),
    queryFn: () => getArmsByLevel(levelId, branchId),
    enabled: !!levelId,
    retry: false,
  });
};
