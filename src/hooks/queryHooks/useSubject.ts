import { getTeacherSubjects } from "@/api/subject";
import { subjectKeys } from "@/queries/subject";
import { useQuery } from "@tanstack/react-query";

export const useGetTeacherSubjects = () => {
  return useQuery({
    queryKey: subjectKeys.mysubjects,
    queryFn: () => getTeacherSubjects(),
    retry: false,
  });
};
