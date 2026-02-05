import { addStudent, getStudents, uploadStudents } from "@/api/student";
import { StudentsStatus } from "@/components/StudentAndParent/types";
import { studentKeys } from "@/queries/student";
import { Pagination } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAddStudent = () => {
  return useMutation({
    mutationKey: studentKeys.addStudent,
    mutationFn: addStudent,
  });
};

export const useGetStudents = ({
  pagination,
  branchId,
  classId,
  departmentId,
  armId,
  status,
}: {
  pagination: Pagination;
  branchId?: number;
  classId?: number;
  departmentId?: number;
  armId?: number;
  status?: StudentsStatus;
}) => {
  return useQuery({
    queryKey: [studentKeys.all, pagination.page, branchId, classId, departmentId, armId, status],
    queryFn: () => getStudents({ pagination, branchId, classId, departmentId, armId, status }),
    enabled: branchId !== null,
  });
};

export const useUploadStudents = () => {
  return useMutation({
    mutationKey: studentKeys.studentsUpload,
    mutationFn: uploadStudents,
  });
};
