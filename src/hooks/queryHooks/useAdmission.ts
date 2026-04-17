import { addAdmissionNumberSetup } from "@/api/admission";
import { admissionKeys } from "@/queries/admission";
import { useMutation } from "@tanstack/react-query";

export const useAddmissionNumber = () => {
  return useMutation({
    mutationKey: admissionKeys.add,
    mutationFn: addAdmissionNumberSetup,
  });
};
