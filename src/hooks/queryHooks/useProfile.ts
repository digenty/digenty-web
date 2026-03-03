import { getUserProfileDetails } from "@/api/profile";
import { profileKey } from "@/queries/profile";
import { useQuery } from "@tanstack/react-query";

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: profileKey.user,
    queryFn: getUserProfileDetails,
  });
};
