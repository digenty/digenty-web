import { addRole, getRoles } from "@/api/role";
import { roleKeys } from "@/queries/role";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetRoles = ({ search }: { search: string }) => {
  return useQuery({
    queryKey: [roleKeys.roles, search],
    queryFn: () => getRoles({ search }),
  });
};

export const useAddRole = () => {
  return useMutation({
    mutationKey: roleKeys.addRole,
    mutationFn: addRole,
  });
};
