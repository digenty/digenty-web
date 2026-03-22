import { addSchoolStructure } from "@/api/academic";
import { academicKey } from "@/queries/academic";
import { useMutation } from "@tanstack/react-query";

export const useAddSchoolStructure = () => {
  return useMutation({
    mutationKey: academicKey.add,
    mutationFn: addSchoolStructure,
  });
};
