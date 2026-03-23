import { EditRequestResponseTypes } from "@/api/types";
import { Avatar } from "@/components/Avatar";
import Calendar from "@/components/Icons/Calendar";
import GraduationCap from "@/components/Icons/GraduationCap";
import { StickyNote } from "@/components/Icons/StickyNote";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { DrawerFooter } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/useIsMobile";
import { formatRelativeDate } from "@/lib/utils";
import { Clock3 } from "lucide-react";

interface ManageEditModalProps {
  open: boolean;
  closeModal: () => void;
  selectedRequest: EditRequestResponseTypes | null;
  pendingAction: "accepted" | "rejected" | null;
  handleConfirm: (action: "accepted" | "rejected") => void;
  isSubmitting?: boolean;
}

export const ManageEditModal = ({ open, closeModal, selectedRequest, pendingAction, handleConfirm, isSubmitting }: ManageEditModalProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="">
      {!isMobile ? (
        <div className="">
          <Modal
            open={open}
            setOpen={closeModal}
            title="Manage edit access request"
            ActionButton={
              <div>
                {pendingAction === "rejected" ? (
                  <Button
                    onClick={() => handleConfirm("rejected")}
                    disabled={isSubmitting}
                    className="bg-bg-state-destructive text-text-white-default hover:bg-bg-state-destructive-hover! h-7 w-fit text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting && <Spinner />}
                    Reject Access
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleConfirm("accepted")}
                    disabled={isSubmitting}
                    className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary-hover! h-7 w-fit text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting && <Spinner />}
                    Approve Access
                  </Button>
                )}
              </div>
            }
          >
            <div className="flex flex-col gap-5 px-6 py-4">
              {selectedRequest?.teacherName && (
                <div className="flex flex-col gap-4">
                  <div className="text-text-subtle text-sm">Review the teacher&apos;s request for edit access</div>
                  <div className="border-border-default flex flex-col rounded-md border py-3">
                    <div className="border-border-default flex flex-col gap-2 border-b px-3 pb-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-5" url="" /> <p className="text-text-default text-sm font-medium">{selectedRequest.teacherName}</p>
                      </div>

                      <div className="text-text-muted text-xs">{selectedRequest.teacherEmail || "--"}</div>
                    </div>

                    <div className="border-border-default flex flex-col gap-3 border-b p-3">
                      <div className="flex items-center gap-2">
                        <GraduationCap fill="var(--color-icon-default-muted)" className="5" />
                        <span className="text-text-muted text-sm">Class/Subject:</span>
                        <span className="text-text-default text-sm font-medium">
                          {selectedRequest.classArmName} {selectedRequest.subjectName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar fill="var(--color-icon-default-muted)" className="size-4" />
                        <span className="text-text-muted text-sm">Term:</span>
                        <span className="text-text-default text-sm font-medium">{selectedRequest.termName}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 px-3 pt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-text-muted text-sm">Reason:</span>
                        <span className="text-text-default text-sm">{selectedRequest.reason}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <StickyNote fill="var(--color-icon-default-muted)" /> <span className="text-text-muted text-sm">Note</span>
                      </div>

                      <div className="bg-bg-muted text-text-default rounded-sm p-3 text-sm font-medium">{selectedRequest.reason}</div>

                      <div className="flex items-center gap-3">
                        <Clock3 className="text-text-default size-4 font-light" />
                        {selectedRequest.dateCreated ? (
                          <p className="text-text-muted text-sm">Requested {formatRelativeDate(new Date(selectedRequest.dateCreated))}</p>
                        ) : (
                          "--"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Modal>
        </div>
      ) : (
        <div className="md:hidden">
          <MobileDrawer open={open} setIsOpen={closeModal} title="Manage edit access request">
            <div className="flex flex-col gap-5 p-4">
              {selectedRequest && (
                <div className="flex flex-col gap-4">
                  <div className="text-text-subtle text-sm">Review the teacher&apos;s request for edit access</div>
                  <div className="border-border-default flex flex-col rounded-md border py-3">
                    <div className="border-border-default flex flex-col gap-2 border-b px-3 pb-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-5" url="" /> <p className="text-text-default text-sm font-medium">{selectedRequest?.teacherName}</p>
                      </div>

                      <div className="text-text-muted text-xs">{selectedRequest?.teacherEmail || "--"}</div>
                    </div>

                    <div className="border-border-default flex flex-col gap-3 border-b p-3">
                      <div className="flex items-center gap-2">
                        <GraduationCap fill="var(--color-icon-default-muted)" className="5" />
                        <span className="text-text-muted text-sm">Class/Subject:</span>
                        <span className="text-text-default text-sm font-medium">
                          {selectedRequest?.classArmName} {selectedRequest?.subjectName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar fill="var(--color-icon-default-muted)" className="size-4" />
                        <span className="text-text-muted text-sm">Term:</span>
                        <span className="text-text-default text-sm font-medium">First Term 24/25</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 px-3 pt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-text-muted text-sm">Reason:</span>
                        <span className="text-text-default text-sm">{selectedRequest?.reason}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <StickyNote fill="var(--color-icon-default-muted)" /> <span className="text-text-muted text-sm">Note</span>
                      </div>

                      <div className="bg-bg-muted text-text-default rounded-sm p-3 text-sm font-medium">{selectedRequest?.reason}</div>
                      <div className="flex items-center gap-3">
                        <Clock3 className="text-text-default size-4 font-light" />
                        {selectedRequest?.dateCreated ? (
                          <p className="text-text-muted text-sm">Requested {formatRelativeDate(new Date(selectedRequest?.dateCreated))}</p>
                        ) : (
                          "--"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DrawerFooter className="border-border-default border-t">
              <div className="flex justify-between">
                <Button
                  onClick={() => handleConfirm("rejected")}
                  disabled={isSubmitting}
                  className="bg-bg-state-destructive text-text-white-default hover:bg-bg-state-destructive-hover! h-7 w-fit text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting && <Spinner />}
                  Reject Access
                </Button>

                <Button
                  onClick={() => handleConfirm("accepted")}
                  disabled={isSubmitting}
                  className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary-hover! h-7 w-fit text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting && <Spinner />}
                  Approve Access
                </Button>
              </div>
            </DrawerFooter>
          </MobileDrawer>
        </div>
      )}
    </div>
  );
};
