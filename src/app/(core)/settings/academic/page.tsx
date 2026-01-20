"use client";

import { ArrowRightCircleFill } from "@/components/Icons/ArrowRightCircleFill";
import { ViewTimelineT } from "@/components/Icons/ViewTimelineT";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const AcedmicSettingPage = () => {
  const route = useRouter();
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <ViewTimelineT />
        <div className="text-center">
          <div className="text-text-default text-lg font-medium">Let’s set up your academic structure</div>
          <div className="text-text-muted text-xs">You’ve not set up your academic structure. Click below to set it up.</div>
        </div>
        <Button
          onClick={() => route.push("/settings/academic/academic-setup")}
          className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default rounded-md"
        >
          Set Up <ArrowRightCircleFill fill="var(--color-icon-white-default)" />
        </Button>
      </div>
    </div>
  );
};

export default AcedmicSettingPage;
