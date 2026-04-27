import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

export const SubjectReportPermissionWrapper = ({
  children,
  subjectId,
  isLoading,
  type,
}: {
  children: React.ReactNode;
  subjectId: number;
  isLoading: boolean;
  type: "view" | "edit";
}) => {
  const { isUserLoading, ...user } = useLoggedInUser();
  const adminEditAccess = user.isMain && type === "edit";
  const adminViewAccess = (user.isMain || user.isAdmin) && type === "view";
  const hasSubjectAccess = user.subjectIds?.includes(Number(subjectId));

  return (
    <>
      {isUserLoading && (
        <div className="flex items-center justify-center p-4 md:px-8 md:py-4">
          <Skeleton className="bg-bg-input-soft h-screen w-full" />
        </div>
      )}

      {!isUserLoading && !hasSubjectAccess && adminEditAccess && !isLoading && (
        <div className="flex h-80 items-center justify-center pt-15">
          <PageEmptyState title="Unauthorized" description="You are not authorized to view this page" buttonText="Go to Home page" url="/staff/" />
        </div>
      )}

      {!isUserLoading && (hasSubjectAccess || adminViewAccess) && children}
    </>
  );
};
