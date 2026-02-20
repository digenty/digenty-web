import { getTermsBySession } from "@/api/term";
import { termKeys } from "@/queries/term";
import { useQuery } from "@tanstack/react-query";

export const useGetTerms = (schoolId?: number) => {
  return useQuery({
    queryKey: termKeys.termsBySession,
    queryFn: () => getTermsBySession(schoolId),
    enabled: !!schoolId,
  });
};
