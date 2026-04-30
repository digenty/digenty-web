"use client";

import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AdmissionCycleSetup } from "../AdmissionCycleSetup";
import { CreateCycleModal } from "./CreateCycleModal";

export const AdmissionCyclesManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasCycle, setHasCycle] = useState(false);

  if (hasCycle) {
    return <AdmissionCycleSetup />;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-text-default text-xl font-semibold">Admission Cycles Management</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium"
        >
          + Create New Cycle
        </Button>
      </div>

      <PageEmptyState title="No admission cycle found" description="Ready to start your admission process?" buttonText="Begin Set Up" />

      <CreateCycleModal open={isModalOpen} setOpen={setIsModalOpen} onSuccess={() => setHasCycle(true)} />
    </div>
  );
};
