import { canView } from "@/lib/permissions/students-and-parents";
import { PageEmptyState } from "../Error/PageEmptyState";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { Skeleton } from "../ui/skeleton";

export const ModulePermissionsWrapper = ({ children }: { children: React.ReactNode }) => {
  const user = useLoggedInUser();

  return (
    <>
      {!user?.permissions && !canView(user?.permissions) && <Skeleton className="bg-bg-basic-gray-subtle2 h-200 w-full rounded-none" />}
      {user?.permissions && canView(user?.permissions) ? (
        children
      ) : (
        <PageEmptyState
          title="You don't have permissions to view this page"
          description="You can ask the Administrator to grant you at least a view permission to view this module"
          buttonText="Go to Home page"
          url="/"
        />
      )}
    </>
  );
};
