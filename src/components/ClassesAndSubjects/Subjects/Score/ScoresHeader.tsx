import CheckboxCircleFill from "@/components/Icons/CheckboxCircleFill";
import Save from "@/components/Icons/Save";
import ShareBox from "@/components/Icons/ShareBox";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import SubmitScoreModal from "./SubmitScoreModal";
import Question from "@/components/Icons/Question";
import RequestEdit from "../RequestEdit";

export default function ScoresHeader() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openRequest, setOpenRequest] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const subject = searchParams.get("subject");
  const isSubmitted = !!searchParams.get("submitted");
  const isRequested = !!searchParams.get("requested");

  return (
    <>
      {openModal && <SubmitScoreModal open={openModal} onOpenChange={setOpenModal} />}
      {openRequest && <RequestEdit open={openRequest} onOpenChange={setOpenRequest} />}

      <div className="border-border-default border-b md:p-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:px-8 md:py-2">
          <h2 className="text-text-default truncate px-4 py-2 text-lg font-semibold md:p-0">JSS 1 A, {subject}</h2>

          <div className="border-border-default overflow-x-auto border-t px-4 py-2 md:border-none md:p-0">
            <div className="flex items-center gap-2 md:gap-1">
              <Button
                size="sm"
                className="border-border-default bg-bg-state-secondary text-text-default flex h-8 w-22 items-center gap-1 border text-sm"
              >
                <ShareBox fill="var(--color-icon-default-muted)" /> Export
              </Button>

              {!isSubmitted && !isRequested && (
                <div className="flex items-center gap-2 md:gap-1">
                  <Button
                    size="sm"
                    className="border-border-default bg-bg-state-secondary text-text-default flex h-8 w-33 items-center justify-between gap-1 border text-sm"
                  >
                    <Save fill="var(--color-icon-default-muted)" className="size-3" /> Save as Draft
                  </Button>

                  <Button
                    onClick={() => setOpenModal(true)}
                    size="sm"
                    className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! flex h-8 w-30 items-center gap-1 text-sm font-normal md:w-23"
                  >
                    <CheckboxCircleFill fill="var(--color-icon-white-default)" className="size-3" />
                    Submit
                  </Button>
                </div>
              )}

              {isSubmitted && !isRequested && (
                <Button
                  size="sm"
                  onClick={() => setOpenRequest(true)}
                  className="border-border-default bg-bg-state-secondary text-text-default flex h-8 w-auto items-center justify-between gap-1 border text-sm"
                >
                  <Question fill="var(--color-icon-default-muted)" /> Request Edit Access
                </Button>
              )}

              {isRequested && (
                <Button
                  size="sm"
                  className="border-border-default bg-bg-state-disabled! text-text-hint flex h-8 w-auto cursor-not-allowed items-center justify-between gap-1 border text-sm"
                >
                  <Question fill="var(--color-icon-default-muted)" /> Requested Edit Access
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
