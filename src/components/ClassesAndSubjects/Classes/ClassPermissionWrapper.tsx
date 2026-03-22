import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

export const ClassPermissionWrapper = ({ children, armId, isLoading }: { children: React.ReactNode; armId: number; isLoading: boolean }) => {
  const user = useLoggedInUser();

  return (
    <>
      {Object.keys(user).length === 0 && (
        <div className="flex items-center justify-center p-4 md:px-8 md:py-4">
          <Skeleton className="bg-bg-input-soft h-screen w-full" />
        </div>
      )}

      {Object.keys(user).length > 0 && !user.armIds?.includes(Number(armId)) && !isLoading && (
        <div className="flex h-80 items-center justify-center pt-15">
          <PageEmptyState title="Unauthorized" description="You are not authorized to view this page" buttonText="Go to Home page" url="/" />
        </div>
      )}

      {user && user.armIds?.includes(Number(armId)) && children}
    </>
  );
};
