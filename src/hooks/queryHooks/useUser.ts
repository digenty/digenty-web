import { getUserByEmail } from "@/api/user";
import { userKeys } from "@/queries/user";
import { useQuery } from "@tanstack/react-query";

export const useGetUserByEmail = (email: string, enabled?: boolean) => {
  return useQuery({
    queryKey: userKeys.userByEmail(email),
    queryFn: () => getUserByEmail(email),
    enabled,
    retry: false,
  });
};
