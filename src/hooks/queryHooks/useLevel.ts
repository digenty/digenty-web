import { getLevels } from "@/api/level";
import { levelKeys } from "@/queries/level";
import { useQuery } from "@tanstack/react-query";

export const useGetLevels = (branchId: number) => {
  return useQuery({
    queryKey: [levelKeys.levels, branchId],
    queryFn: () => getLevels(branchId),
  });
};
