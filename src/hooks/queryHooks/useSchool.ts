import { addSchool } from "@/api/school";
import { schoolsKey } from "@/queries/school";
import { useMutation } from "@tanstack/react-query";

export const useAddSchool = () => {
  return useMutation({
    mutationKey: schoolsKey.addSchool,
    mutationFn: addSchool,
  });
};
