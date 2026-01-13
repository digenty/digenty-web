import { addStudent } from "@/api/student";
import { studentKeys } from "@/queries/student";
import { useMutation } from "@tanstack/react-query";

export const useAddStudent = () => {
  return useMutation({
    mutationKey: studentKeys.addStudent,
    mutationFn: addStudent,
  });
};
