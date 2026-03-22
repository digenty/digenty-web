import { addRole, deleteRole, getRole, getRoles, updateRole } from "@/api/role";
import { roleKeys } from "@/queries/role";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetRoles = (search?: string) => {
  return useQuery({
    queryKey: [roleKeys.roles, search],
    queryFn: () => getRoles(search),
  });
};

export const useAddRole = () => {
  return useMutation({
    mutationKey: roleKeys.addRole,
    mutationFn: addRole,
  });
};

export const useDeleteRole = (roleId?: number) => {
  return useMutation({
    mutationKey: roleKeys.deleteRole,
    mutationFn: () => deleteRole(roleId),
  });
};

export const useUpdateRole = () => {
  return useMutation({
    mutationKey: roleKeys.updateRole,
    mutationFn: updateRole,
  });
};

export const useGetRole = (roleId: number) => {
  return useQuery({
    queryKey: [roleKeys.getRole, roleId],
    queryFn: () => getRole(roleId),
  });
};
