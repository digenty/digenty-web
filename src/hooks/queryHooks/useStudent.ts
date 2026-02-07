import { addStudent, deleteStudents, exportStudents, getStudents, getStudentsDistribution, uploadStudents, withdrawStudents } from "@/api/student";
import { StudentsStatus } from "@/components/StudentAndParent/types";
import { studentKeys } from "@/queries/student";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

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
  search,
}: {
  limit: number;
  branchId?: number;
  classId?: number;
  departmentId?: number;
  armId?: number;
  status?: StudentsStatus;
  search?: string;
}) => {
  return useInfiniteQuery({
    queryKey: [studentKeys.all, branchId, classId, departmentId, armId, status, search],
    queryFn: ({ pageParam }) => getStudents({ pageParam, limit, branchId, classId, departmentId, armId, status, search }),
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

export const useGetStudentsDistribution = (branchId?: number) => {
  return useQuery({
    queryKey: [studentKeys.studentsDistributionByBranch, branchId],
    queryFn: () => getStudentsDistribution(branchId),
  });
};

export const useExportStudents = ({
  branchId,
  classId,
  armId,
  status,
}: {
  branchId?: number;
  classId?: number;
  armId?: number;
  status?: StudentsStatus;
}) => {
  return useMutation({
    mutationKey: studentKeys.exportStudents,
    mutationFn: () => exportStudents({ branchId, classId, armId, status }),
  });
};

export const useWithdrawStudents = () => {
  return useMutation({
    mutationKey: studentKeys.withdrawStudents,
    mutationFn: (studentIds: number[]) => withdrawStudents(studentIds),
  });
};

export const useDeleteStudents = () => {
  return useMutation({
    mutationKey: studentKeys.deleteStudents,
    mutationFn: (studentIds: number[]) => deleteStudents(studentIds),
  });
};
