import { getAdmissionNumber, updateAdmissionNumber } from "@/api/admission";
import { UpdateAdmissionNumber } from "@/api/types";
import { admissiomKey } from "@/queries/admission";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAdmissionNumberDetails = () => {
  return useQuery({
    queryKey: admissiomKey.get,
    queryFn: getAdmissionNumber,
  });
};

export const useUpdateAdmissionNumber = () => {
  return useMutation({
    mutationKey: admissiomKey.update,
    mutationFn: ({ payload, id }: { payload: UpdateAdmissionNumber; id: number }) => updateAdmissionNumber(payload, id),
  });
};
