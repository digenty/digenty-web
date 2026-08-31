import { getAdmissionNumber, updateAdmissionNumber } from "@/api/admission";
import { UpdateAdmissionNumber } from "@/api/types";
import { admissionKeys } from "@/queries/admission";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAdmissionNumberDetails = () => {
  return useQuery({
    queryKey: admissionKeys.get,
    queryFn: getAdmissionNumber,
  });
};

export const useUpdateAdmissionNumber = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: admissionKeys.update,
    mutationFn: ({ payload, id }: { payload: UpdateAdmissionNumber; id: number }) => updateAdmissionNumber(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: admissionKeys.get });
    },
  });
};
