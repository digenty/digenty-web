import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

export const AttendanceMgtWrapper = ({ children, armIds, isLoading }: { children: React.ReactNode; armIds: number[]; isLoading: boolean }) => {
  const user = useLoggedInUser();
  const userExists = user && Object.keys(user).length > 0;
  const hasArmAccess = userExists && user.armIds?.some(armId => armIds.includes(armId));
  const isAdmin = userExists && (user.isAdmin || user.isMain || (user?.adminBranchIds?.length ?? 0) > 0);

  return (
    <>
      {!userExists && isLoading && (
        <div className="flex items-center justify-center p-4 md:px-8 md:py-4">
          <Skeleton className="bg-bg-input-soft h-screen w-full" />
        </div>
      )}

      {userExists && !isLoading && !hasArmAccess && !isAdmin && (
        <div className="flex h-150 items-center justify-center pt-15">
          <PageEmptyState
            title="Unauthorized"
            description="You are not authorized to view this page. You should be the class teacher of at least a class"
            buttonText="Go to Home page"
            url="/staff/"
          />
        </div>
      )}

      {userExists && !isLoading && (hasArmAccess || isAdmin) && children}
    </>
  );
};
