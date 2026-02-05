import { addStudent, getStudents, uploadStudents } from "@/api/student";
import { studentKeys } from "@/queries/student";
import { Pagination } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAddStudent = () => {
  return useMutation({
    mutationKey: studentKeys.addStudent,
    mutationFn: addStudent,
  });
};

export const useGetStudents = ({ pagination, branchId, classId }: { pagination: Pagination; branchId?: number; classId?: number }) => {
  return useQuery({
    queryKey: [studentKeys.all, branchId],
    queryFn: () => getStudents({ pagination, branchId, classId }),
    enabled: branchId !== null,
  });
};

export const useUploadStudents = () => {
  return useMutation({
    mutationKey: studentKeys.studentsUpload,
    mutationFn: uploadStudents,
  });
};
