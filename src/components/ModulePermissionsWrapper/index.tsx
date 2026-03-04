import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { PageEmptyState } from "../Error/PageEmptyState";
import { Skeleton } from "../ui/skeleton";

export const ModulePermissionsWrapper = ({
  children,
  permissionUtility,
}: {
  children: React.ReactNode;
  permissionUtility: (permissions: string[] | undefined) => boolean;
}) => {
  const user = useLoggedInUser();
  const hasPermission = permissionUtility(user?.permissions);

  return (
    <>
      {!user?.permissions && <Skeleton className="bg-bg-basic-gray-subtle2 h-200 w-full rounded-none" />}

      {user?.permissions && !hasPermission && (
        <PageEmptyState
          title="You don't have permissions to view this page"
          description="You can ask the Administrator to grant you at least a view permission to view this module"
          buttonText="Go to Home page"
          url="/"
        />
      )}

      {user?.permissions && hasPermission && children}
    </>
  );
};
