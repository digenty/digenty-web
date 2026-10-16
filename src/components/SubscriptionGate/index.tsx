"use client";

import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { useGetCurrentSubscription } from "@/hooks/queryHooks/useSubscription";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { isSubscriptionError } from "@/lib/apiError";
import { canManageSettings } from "@/lib/permissions/settings";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SUBSCRIPTION_PATH = "/staff/settings/subscription";

export const SubscriptionGate = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { isMain, isAdmin, permissions, isUserLoading } = useLoggedInUser();
  const { data: subscription, isLoading, isError, error } = useGetCurrentSubscription();
  const [open, setOpen] = useState(false);

  const hasActiveSubscription = subscription?.data?.status === "ACTIVE";
  const isOnSubscriptionPage = pathname.startsWith(SUBSCRIPTION_PATH);
  // Only school owners/admins can subscribe, so only they are prompted. Staff such as teachers can't
  // act on it, and their request may fail or come back empty even when the school is subscribed.
  const canSubscribe = !!isMain || !!isAdmin || canManageSettings(permissions);
  // A failed request only counts as "no subscription" when the API says so (not found / subscription
  // error); any other failure (network, permission) must not lock a subscribed school out.
  const noSubscriptionError = isError && ((error as { status?: number } | null)?.status === 404 || isSubscriptionError(error));
  const shouldBlock =
    canSubscribe && !isUserLoading && !isLoading && (isError ? noSubscriptionError : !hasActiveSubscription) && !isOnSubscriptionPage;

  // Re-open on every navigation (and on first load) while there is no active subscription.
  useEffect(() => {
    setOpen(shouldBlock);
  }, [pathname, shouldBlock]);

  const goToSubscription = () => {
    setOpen(false);
    router.push(SUBSCRIPTION_PATH);
  };

  const body = (
    <div className="px-4 py-6 md:px-6">
      <p className="text-text-default text-base font-semibold">You don&apos;t have an active subscription</p>
      <p className="text-text-muted mt-2 text-sm">Subscribe to a plan to continue using all features on your school&apos;s dashboard.</p>
    </div>
  );

  const actionButton = (
    <Button onClick={goToSubscription} className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 px-2 py-1">
      <span className="text-sm font-medium">Go to Subscription</span>
    </Button>
  );

  if (isMobile) {
    return (
      <MobileDrawer open={open} setIsOpen={setOpen} title="No Active Subscription">
        {body}
        <div className="bg-bg-card border-border-default flex items-center justify-between border-t px-3 py-4">
          <Button
            onClick={() => setOpen(false)}
            variant="outline"
            className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle hover:text-text-subtle h-7 border-none px-2 py-1 text-sm font-medium"
          >
            Cancel
          </Button>
          {actionButton}
        </div>
      </MobileDrawer>
    );
  }

  return (
    <Modal open={open} setOpen={setOpen} title="No Active Subscription" ActionButton={actionButton}>
      {body}
    </Modal>
  );
};
