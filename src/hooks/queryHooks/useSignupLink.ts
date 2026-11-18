import { createSignupLink, getSignupLink, setSignupLinkActive } from "@/api/signup-link";
import { signupLinkKeys } from "@/queries/signup-link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetSignupLink = (enabled = true) => {
  return useQuery({
    queryKey: signupLinkKeys.signupLink,
    queryFn: getSignupLink,
    enabled,
    retry: false,
  });
};

// Used for both "create" and "regenerate" — the backend treats them as the same call.
export const useCreateSignupLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: signupLinkKeys.createSignupLink,
    mutationFn: createSignupLink,
    onSuccess: link => {
      queryClient.setQueryData(signupLinkKeys.signupLink, link);
    },
  });
};

export const useSetSignupLinkActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: signupLinkKeys.setSignupLinkActive,
    mutationFn: setSignupLinkActive,
    onSuccess: () => {
      // The PATCH response shape isn't guaranteed to carry the whole link, so re-read it.
      queryClient.invalidateQueries({ queryKey: signupLinkKeys.signupLink });
    },
  });
};
