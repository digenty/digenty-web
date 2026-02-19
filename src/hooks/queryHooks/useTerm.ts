import { getAllTerms } from "@/api/term";
import { termKeys } from "@/queries/term";
import { useQuery } from "@tanstack/react-query";

export const useGetAllTerms = (schoolId: number) => {
  return useQuery({
    queryKey: termKeys.all(schoolId),
    queryFn: () => getAllTerms(schoolId),
  });
};
