"use client";

import React, { useState } from "react";
import { StudentReview } from "./StudentReview";
import { ParentReview } from "./ParentReview";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useGetParent } from "@/hooks/queryHooks/useParent";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/useIsMobile";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import CheckboxCircleFill from "@/components/Icons/CheckboxCircleFill";

const tabs = ["Your Details", "Student Details"];

export const Review = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [open, setOpen] = useState<boolean>(false);

  const { data, isLoading } = useGetParent();
  const isMobile = useIsMobile();

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setOpen(true);
      setTimeout(() => {
        router.push(`/parent-dashboard`);
      }, 1000);
    }, 2000);
  };

  return (
    <div className="border-border-default flex flex-col gap-4 rounded-md border px-4">
      <div className="border-border-default flex flex-col gap-1 border-b p-3">
        <div className="text-text-default text-md font-semibold">Review Your Information</div>
        <div className="text-text-muted text-xs font-normal">Please verify all details before submitting</div>
      </div>

      <div className="bg-bg-state-soft border-border-default flex w-full rounded-md border">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full items-center px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab ? "text-text-default bg-bg-state-secondary! rounded-md" : "text-text-muted hover:text-text-default"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="pt-4">
        {activeTab === "Your Details" && <ParentReview data={data} isLoading={isLoading} />}
        {activeTab === "Student Details" && <StudentReview />}
      </div>

      {showSuccess && (
        <>
          {isMobile ? (
            <>
              <MobileDrawer title={undefined} showCloseButton={false} open={open} setIsOpen={setOpen}>
                <div className="flex items-center justify-center space-y-5 px-4 py-5">
                  <div className="flex flex-col items-center gap-2">
                    <CheckboxCircleFill fill="var(--color-icon-success)" />

                    <div className="text-text-default text-lg font-semibold">Registration submitted!</div>

                    <div className="text-text-muted text-sm">
                      The school will review and approve your details shortly. Once approved, you&apos;ll receive access to the parent portal.
                    </div>
                  </div>
                </div>
              </MobileDrawer>
            </>
          ) : (
            <>
              <Modal title open={open} setOpen={setOpen} showCloseButton={false} showFooter={false} ActionButton={undefined}>
                <div className="flex items-center justify-center space-y-5 px-4 py-5">
                  <div className="flex flex-col items-center gap-2">
                    <CheckboxCircleFill fill="var(--color-icon-success)" />

                    <div className="text-text-default text-lg font-semibold">Registration submitted!</div>

                    <div className="text-text-muted text-sm">
                      The school will review and approve your details shortly. Once approved, you&apos;ll receive access to the parent portal.
                    </div>
                  </div>
                </div>
              </Modal>
            </>
          )}
        </>
      )}

      <div className="border-border-default flex w-full justify-between border-t pt-4">
        <Button onClick={() => router.back()} className="bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-subtle h-8">
          Back
        </Button>
        {data && (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8"
          >
            {isSubmitting && <Spinner className="text-text-white-default" />} Submit
          </Button>
        )}
      </div>
    </div>
  );
};
