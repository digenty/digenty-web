import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

export const ClassAttendanceWrapper = ({ children, armId, isLoading }: { children: React.ReactNode; armId: number; isLoading: boolean }) => {
  const { isUserLoading, ...user } = useLoggedInUser();
  const userExists = user && Object.keys(user).length > 0;
  const hasArmAccess = userExists && user.armIds?.includes(armId);
  const isAdmin = userExists && (user.isAdmin || user.isMain || (user?.adminBranchIds?.length ?? 0) > 0);

  return (
    <>
      {(isUserLoading || isLoading) && (
        <div className="flex items-center justify-center p-4 md:px-8 md:py-4">
          <Skeleton className="bg-bg-input-soft h-screen w-full" />
        </div>
      )}

      {!isUserLoading && userExists && !isLoading && !hasArmAccess && !isAdmin && (
        <div className="flex h-150 items-center justify-center pt-15">
          <PageEmptyState
            title="Unauthorized"
            description="You are not authorized to view this page. You would need to be the class teacher of this class or an admin"
            buttonText="Go to Home page"
            url="/staff/"
          />
        </div>
      )}

      {!isUserLoading && userExists && !isLoading && (hasArmAccess || isAdmin) && children}
    </>
  );
};
