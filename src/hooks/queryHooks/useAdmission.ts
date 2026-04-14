import { addAdmissionNumberSetup, generateAdmissionNumber } from "@/api/admission";
import { admissionKeys } from "@/queries/admission";
import { useMutation } from "@tanstack/react-query";

export const useAddmissionNumber = () => {
  return useMutation({
    mutationKey: admissionKeys.add,
    mutationFn: addAdmissionNumberSetup,
  });
};

export const useGenerateAdmissionNumber = () => {
  return useMutation({
    mutationKey: admissionKeys.generate,
    mutationFn: generateAdmissionNumber,
  });
};
