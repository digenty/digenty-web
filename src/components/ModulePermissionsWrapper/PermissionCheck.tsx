import { useLoggedInUser } from "@/hooks/useLoggedInUser";

export const PermissionCheck = ({
  permissionUtility,
  children,
}: {
  permissionUtility: (permissions: string[] | undefined) => boolean;
  children: React.ReactNode;
}) => {
  const user = useLoggedInUser();

  return <>{permissionUtility(user?.permissions) && children}</>;
};
