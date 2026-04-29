import { getSecuritySettings, logoutAllSessions } from "@/api/security";
import { securityKeys } from "@/queries/security";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetSecuritySettings = () => {
  return useQuery({
    queryKey: securityKeys.getSecuritySettings,
    queryFn: getSecuritySettings,
  });
};

export const useLogoutAllSessions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: securityKeys.logoutAll,
    mutationFn: logoutAllSessions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: securityKeys.getSecuritySettings });
    },
  });
};
