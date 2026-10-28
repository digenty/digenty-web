import { deleteSession, getSessionToken } from "@/app/actions/auth";
import { getTabUser, observeSession } from "@/lib/session-client";
import { decodeJWT } from "@/lib/utils";
import { JWTPayload } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useLoggedInUser = (): Partial<JWTPayload> & { isUserLoading: boolean } => {
  const { data: currentUser, isLoading: isUserLoading } = useQuery({
    queryKey: ["session-user"],
    queryFn: async (): Promise<JWTPayload | null> => {
      try {
        const { token, userType } = await getSessionToken();
        const user = decodeJWT(token);

        if (!token || !user) {
          deleteSession();
          return null;
        }

        // The cookie is shared by every tab. If another tab has since signed in as someone else, keep
        // showing the person this tab was started as; the session guard tells the user what happened.
        return observeSession(user, userType) === "changed" ? getTabUser() : user;
      } catch (error) {
        console.warn(error);
        return null;
      }
    },
    retry: false,
  });

  return {
    ...currentUser,
    isUserLoading,
  };
};
