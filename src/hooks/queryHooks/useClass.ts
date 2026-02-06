import { getClassTeacher } from "@/api/class";
import { classKeys } from "@/queries/class";
import { useQuery } from "@tanstack/react-query";

export const useGetTeacherClasses = () => {
  return useQuery({
    queryKey: classKeys.all,
    queryFn: () => getClassTeacher(),
    retry: false,
  });
};
