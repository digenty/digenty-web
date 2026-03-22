import { getPermissions } from "@/api/permission";
import { permissionKeys } from "@/queries/permission";
import { useQuery } from "@tanstack/react-query";

export const useGetPermissions = () => {
  return useQuery({
    queryKey: permissionKeys.permissions,
    queryFn: getPermissions,
  });
};
