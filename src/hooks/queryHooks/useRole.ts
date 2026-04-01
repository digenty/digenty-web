import { addRole, deleteRole, getRole, getRoles, updateRole } from "@/api/role";
import { roleKeys } from "@/queries/role";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetRoles = (search?: string) => {
  return useQuery({
    queryKey: [roleKeys.roles, search],
    queryFn: () => getRoles(search),
  });
};

export const useAddRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: roleKeys.addRole,
    mutationFn: addRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [roleKeys.roles] });
    },
  });
};

export const useDeleteRole = (roleId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: roleKeys.deleteRole,
    mutationFn: () => deleteRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [roleKeys.roles] });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: roleKeys.updateRole,
    mutationFn: updateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [roleKeys.roles] });
    },
  });
};

export const useGetRole = (roleId: number) => {
  return useQuery({
    queryKey: [roleKeys.getRole, roleId],
    queryFn: () => getRole(roleId),
  });
};
