import { getUserProfileDetails, updateUserProfile, UpdateUserProfilePayload } from "@/api/profile";
import { profileKey } from "@/queries/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: profileKey.user,
    queryFn: getUserProfileDetails,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: profileKey.update,
    mutationFn: (payload: UpdateUserProfilePayload) => updateUserProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKey.user });
    },
  });
};
