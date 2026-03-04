import { getClasses, getClassTeachersInClass, getTeacherClass } from "@/api/class";
import { classKeys } from "@/queries/class";
import { useQuery } from "@tanstack/react-query";

export const useGetClasses = (branchId?: number) => {
  return useQuery({
    queryKey: [classKeys.classes, branchId],
    queryFn: () => getClasses(branchId),
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
export const useGetClassTeachersInClass = (armId: number) => {
  return useQuery({
    queryKey: classKeys.class(armId),
    queryFn: () => getClassTeachersInClass(armId),
    retry: false,
  });
};
