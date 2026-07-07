import { getParentStudents, getStudentAcademicRecord, getStudentOverview } from "@/api/parent-students";
import { parentStudentsKeys } from "@/queries/parent-students";
import { useQuery } from "@tanstack/react-query";

export const useGetParentStudents = () => {
  return useQuery({
    queryKey: parentStudentsKeys.all,
    queryFn: getParentStudents,
    retry: false,
  });
};

export const useGetStudentOverview = (studentId?: number) => {
  return useQuery({
    queryKey: parentStudentsKeys.overview(studentId),
    queryFn: () => getStudentOverview(studentId!),
    enabled: !!studentId,
    retry: false,
  });
};

export const useGetStudentAcademicRecord = (studentId?: number, termId?: number) => {
  return useQuery({
    queryKey: parentStudentsKeys.academicRecord(studentId, termId),
    queryFn: () => getStudentAcademicRecord(studentId!, termId),
    enabled: !!studentId,
    retry: false,
  });
};
