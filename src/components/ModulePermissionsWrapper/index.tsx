"use client";

import { useEffect, useState } from "react";
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

  // The session-user query can already be cached client-side (e.g. from a previous page)
  // while a fresh server render always starts uncached, so branching on it directly can
  // render permission-gated content on the very first client paint when the server paint
  // was still the loading skeleton — a hydration mismatch. Deferring the real branch to
  // after mount keeps the first client paint identical to the server's.
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted || !user?.permissions) {
    return <Skeleton className="bg-bg-basic-gray-subtle2 h-200 w-full rounded-none" />;
  }

  if (!hasPermission) {
    return (
      <PageEmptyState
        title="You don't have permissions to view this page"
        description="You can ask the Administrator to grant you at least a view permission to view this module"
        buttonText="Go to Home page"
        url="/staff/"
      />
    );
  }

  return <>{children}</>;
};
