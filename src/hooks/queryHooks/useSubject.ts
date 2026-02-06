import { getTeacherSubjects } from "@/api/subject";
import { SubjectKey } from "@/queries/subject";
import { useQuery } from "@tanstack/react-query";

export const useGetTeacherSubject = () => {
  return useQuery({
    queryKey: SubjectKey.all,
    queryFn: () => getTeacherSubjects(),
    retry: false,
  });
};
