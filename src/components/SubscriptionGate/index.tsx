"use client";

import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { useGetCurrentSubscription } from "@/hooks/queryHooks/useSubscription";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SUBSCRIPTION_PATH = "/staff/settings/subscription";

export const SubscriptionGate = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { data: subscription, isLoading, isError } = useGetCurrentSubscription();
  const [open, setOpen] = useState(false);

  const hasActiveSubscription = subscription?.data?.status === "ACTIVE";
  const isOnSubscriptionPage = pathname.startsWith(SUBSCRIPTION_PATH);
  const shouldBlock = !isLoading && (isError || !hasActiveSubscription) && !isOnSubscriptionPage;

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
