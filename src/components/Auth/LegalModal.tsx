"use client";
import React from "react";
import { Modal } from "@/components/Modal";
import { MobileDrawer } from "@/components/MobileDrawer";
import { useIsMobile } from "@/hooks/useIsMobile";

interface LegalModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  content: string;
}

export const LegalModal: React.FC<LegalModalProps> = ({ open, setOpen, title, content }) => {
  const isMobile = useIsMobile();

  const formattedContent = (
    <div className="max-h-[70vh] overflow-y-auto px-4 pb-4 md:px-6">
      <div className="prose prose-sm text-text-muted text-sm leading-relaxed font-normal whitespace-pre-wrap">{content}</div>
    </div>
  );

  if (isMobile) {
    return (
      <MobileDrawer open={open} setIsOpen={setOpen} title={title}>
        {formattedContent}
      </MobileDrawer>
    );
  }

  return (
    <Modal open={open} setOpen={setOpen} title={title} showFooter={false}>
      {formattedContent}
    </Modal>
  );
};
