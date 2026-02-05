import { addStudent, getStudents, uploadStudents } from "@/api/student";
import { StudentsStatus } from "@/components/StudentAndParent/types";
import { studentKeys } from "@/queries/student";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";

export const useAddStudent = () => {
  return useMutation({
    mutationKey: studentKeys.addStudent,
    mutationFn: addStudent,
  });
};

export const useGetStudents = ({
  limit,
  branchId,
  classId,
  departmentId,
  armId,
  status,
}: {
  limit: number;
  branchId?: number;
  classId?: number;
  departmentId?: number;
  armId?: number;
  status?: StudentsStatus;
}) => {
  return useInfiniteQuery({
    queryKey: [studentKeys.all, branchId, classId, departmentId, armId, status],
    queryFn: ({ pageParam }) => getStudents({ pageParam, limit, branchId, classId, departmentId, armId, status }),
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1; // next page index
    },
  });
};

export const useUploadStudents = () => {
  return useMutation({
    mutationKey: studentKeys.studentsUpload,
    mutationFn: uploadStudents,
  });
};
