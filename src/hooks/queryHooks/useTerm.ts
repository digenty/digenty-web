import { getAllTerms } from "@/api/term";
import { termKeys } from "@/queries/term";
import { useQuery } from "@tanstack/react-query";

export const useGetTerms = (schoolId?: number) => {
  return useQuery({
    queryKey: termKeys.terms(schoolId),
    queryFn: () => getAllTerms(schoolId),
    enabled: !!schoolId,
  });
};
