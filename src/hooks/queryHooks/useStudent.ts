import {
  addStudent,
  deleteStudents,
  editStudent,
  exportStudents,
  getStudent,
  getStudents,
  getStudentsDistribution,
  uploadStudents,
  withdrawStudents,
} from "@/api/student";
import { StudentsStatus } from "@/components/StudentAndParent/types";
import { studentKeys } from "@/queries/student";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAddStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: studentKeys.addStudent,
    mutationFn: addStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [studentKeys.all] });
      queryClient.invalidateQueries({ queryKey: [studentKeys.studentsDistributionByBranch] });
    },
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: studentKeys.studentsUpload,
    mutationFn: uploadStudents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [studentKeys.all] });
      queryClient.invalidateQueries({ queryKey: [studentKeys.studentsDistributionByBranch] });
    },
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

export const useWithdrawStudents = (studentIds: number[]) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: studentKeys.withdrawStudents,
    mutationFn: () => withdrawStudents(studentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [studentKeys.all] });
      queryClient.invalidateQueries({ queryKey: [studentKeys.studentsDistributionByBranch] });
    },
  });
};

export const useDeleteStudents = (studentIds: number[]) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: studentKeys.deleteStudents,
    mutationFn: () => deleteStudents(studentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [studentKeys.all] });
      queryClient.invalidateQueries({ queryKey: [studentKeys.studentsDistributionByBranch] });
    },
  });
};

export const useGetStudent = (studentId?: number) => {
  return useQuery({
    queryKey: [studentKeys.getStudent, studentId],
    queryFn: () => getStudent(studentId),
    enabled: !!studentId,
  });
};

export const useEditStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: studentKeys.editStudent,
    mutationFn: editStudent,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [studentKeys.all] });
      queryClient.invalidateQueries({ queryKey: [studentKeys.getStudent, variables.studentId] });
      queryClient.invalidateQueries({ queryKey: [studentKeys.studentsDistributionByBranch] });
    },
  });
};
