import { getAcademic, updateAcademic } from "@/api/academic";
import { UpdateAcademicPayload } from "@/api/types";
import { academicKey } from "@/queries/academic";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAcademic = () => {
  return useQuery({
    queryKey: academicKey.get,
    queryFn: getAcademic,
  });
};

export const useUpdateAcademic = () => {
  return useMutation({
    mutationKey: academicKey.update,
    mutationFn: ({ payload, sessionId }: { payload: UpdateAcademicPayload; sessionId: number }) => updateAcademic(payload, sessionId),
  });
};
