import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

export const ClassesAndSubjectsPermissionWrapper = ({ children, isLoading }: { children: React.ReactNode; isLoading: boolean }) => {
  const { isUserLoading, ...user } = useLoggedInUser();
  const hasAccess = user.subjectIds && user.armIds && (user.subjectIds?.length > 0 || user?.armIds?.length > 0);

  return (
    <>
      {isUserLoading && (
        <div className="flex items-center justify-center p-4 md:px-8 md:py-4">
          <Skeleton className="bg-bg-input-soft h-screen w-full" />
        </div>
      )}

      {!isUserLoading && !hasAccess && !isLoading && (
        <div className="flex h-80 items-center justify-center pt-15">
          <PageEmptyState title="Unauthorized" description="You are not authorized to view this page" buttonText="Go to Home page" url="/staff/" />
        </div>
      )}

      {!isUserLoading && hasAccess && children}
    </>
  );
};
