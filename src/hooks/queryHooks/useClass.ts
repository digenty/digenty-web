import { getClassesForASchool, getClassReport, getClassTeachersInClass, getTeacherClass } from "@/api/class";
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

export const useGetClassTeachersInClass = (classId: number) => {
  return useQuery({
    queryKey: classKeys.class(classId),
    queryFn: () => getClassTeachersInClass(classId),
    retry: false,
  });
};

export const useGetClassReport = (armId: number, termId: number) => {
  return useQuery({
    queryKey: classKeys.classReport(armId, termId),
    queryFn: () => getClassReport(armId, termId),
    retry: false,
  });
};
