import { addSchoolStructure, getActiveSession, getSessions, updateAcademic } from "@/api/academic";
import { UpdateAcademicPayload } from "@/api/types";
import { academicKey } from "@/queries/academic";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAddSchoolStructure = () => {
  return useMutation({
    mutationKey: academicKey.add,
    mutationFn: addSchoolStructure,
  });
};

export const useGetActiveSession = () => {
  return useQuery({
    queryKey: academicKey.get,
    queryFn: getActiveSession,
  });
};

export const useGetSessions = () => {
  return useQuery({
    queryKey: academicKey.sessions,
    queryFn: getSessions,
  });
};

export const useUpdateAcademic = () => {
  return useMutation({
    mutationKey: academicKey.update,
    mutationFn: ({ payload, sessionId }: { payload: UpdateAcademicPayload; sessionId: number }) => updateAcademic(payload, sessionId),
  });
};
