import { addStudent, getStudents } from "@/api/student";
import { studentKeys } from "@/queries/student";
import { Pagination } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAddStudent = () => {
  return useMutation({
    mutationKey: studentKeys.addStudent,
    mutationFn: addStudent,
  });
};

export const useGetStudents = (pagination: Pagination) => {
  return useQuery({
    queryKey: studentKeys.all,
    queryFn: () => getStudents({ pagination }),
    retry: false,
  });
};
