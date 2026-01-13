"use client";
import { toast } from "@/components/Toast";
import { Spinner } from "@/components/ui/spinner";
import { useAddStudent } from "@/hooks/queryHooks/useStudent";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { studentSchema } from "@/schema/student";
import { AdmissionStatus, BoardingStatus, Gender } from "@/types";
import { useFormik } from "formik";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar } from "../../Avatar";
import DeleteBin from "../../Icons/DeleteBin";
import { Button } from "../../ui/button";
import { StudentInputValues } from "../types";
import { AcademicInformation } from "./AcademicInformation";
import { ContactInformation } from "./ContactInformation";
import { LinkEntity } from "./LinkEntity";
import { PersonalInformation } from "./PersonalInformation";
import { ProfilePicture } from "./ProfilePicture";
import { Tags } from "./Tags";
import { useIsMobile } from "@/hooks/useIsMobile";

export const LinkedParents = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6 py-6">
      <h2 className="text-lg font-semibold">
        Linked Parents <small className="text-text-destructive text-xs">*</small>
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:gap-5">
        <div className="bg-bg-card shadow-light border-border-default flex items-center justify-between rounded-xl border py-2 pr-4 pl-2">
          <div className="flex items-center gap-2">
            <Avatar username="Damilare John" className="size-10" url="" />
            <p className="text-text-default text-sm font-medium">Damilare John</p>
          </div>

          <Button>
            <DeleteBin fill="var(--color-icon-default-subtle)" className="size-4" />
          </Button>
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="text-text-default border-border-darker bg-bg-state-secondary h-10 w-full border border-dashed! text-sm font-medium"
        >
          <PlusIcon className="text-icon-default-muted" />
          <span>Link Parent</span>
        </Button>
      </div>
    </div>
  );
};
