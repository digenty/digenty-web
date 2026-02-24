import { addRole, getRoles } from "@/api/role";
import { roleKeys } from "@/queries/role";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetRoles = () => {
  return useQuery({
    queryKey: roleKeys.roles,
    queryFn: getRoles,
  });
};

export const useAddRole = () => {
  return useMutation({
    mutationKey: roleKeys.addRole,
    mutationFn: addRole,
  });
};
