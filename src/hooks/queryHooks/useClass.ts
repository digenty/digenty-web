import { getClassesForASchool, getClassTeachersInClass, getTeacherClass } from "@/api/class";
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
    queryFn: () => getTeacherClass(),
    retry: false,
  });
};

// To put in another branch
export const useGetClassTeachersInClass = (classId: number) => {
  return useQuery({
    queryKey: classKeys.class(classId),
    queryFn: () => getClassTeachersInClass(classId),
    retry: false,
  });
};
