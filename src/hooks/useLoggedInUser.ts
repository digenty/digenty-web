import { deleteSession, getSessionToken } from "@/app/actions/auth";
import { decodeJWT } from "@/lib/utils";
import { JWTPayload } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useLoggedInUser = (): Partial<JWTPayload> & { isUserLoading: boolean } => {
  const { data: currentUser, isLoading: isUserLoading } = useQuery({
    queryKey: ["session-user"],
    queryFn: async (): Promise<JWTPayload | null> => {
      try {
        const { token } = await getSessionToken();
        const user = decodeJWT(token);

        if (!token || !user) {
          deleteSession();
          return null;
        }

        return user;
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
