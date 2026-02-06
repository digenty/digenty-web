import { getClassesForASchool, getClassTeacher } from "@/api/class";
import { classKeys } from "@/queries/class";
import { useQuery } from "@tanstack/react-query";

export const useGetClasses = () => {
  return useQuery({
    queryKey: classKeys.classes,
    queryFn: getClassesForASchool,
  });
};

export const useGetTeacherClasses = () => {
  return useQuery({
    queryKey: classKeys.all,
    queryFn: () => getClassTeacher(),
    retry: false,
  });
};
