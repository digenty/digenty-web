import { Calendar, GraduationCap, StickyNote, Timee } from "@digenty/icons";
import { Avatar } from "@/components/Avatar";

import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useApproveEditRequest, useGetEditRequestBySubjectAndArm } from "@/hooks/queryHooks/useRequests";
import { useIsMobile } from "@/hooks/useIsMobile";
import { formatRelativeDate } from "@/lib/utils";
import { toast } from "sonner";

type NotifyModalProps = {
  openNotifyModal: boolean;
  setOpenNotifyModal: (openModal: boolean) => void;
};
type ApproveModalProps = {
  openApproveModal: boolean;
  setOpenApproveModal: (openApprove: boolean) => void;
  classArmName: string;
  onConfirm: () => void;
  isSubmitting: boolean;
};

type EditRequestProps = {
  openEditRequestModal: boolean;
  setEditRequestModal: (openEditRequestModal: boolean) => void;
  subjectId: number;
  armId: number;
};

export const NotifyTeacherModal = ({ openNotifyModal, setOpenNotifyModal }: NotifyModalProps) => {
  return (
    <>
      {/* Mobile view */}
      <div className="md:hidden">
        <MobileDrawer open={openNotifyModal} title="Send Notification" setIsOpen={setOpenNotifyModal}>
          <div className="flex flex-col gap-5 px-6 py-4">
            <DialogDescription className="text-text-subtle text-sm font-normal">Add a short message</DialogDescription>

            <div className="mt-3 flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Message</Label>

              <Textarea
                className="bg-bg-input-soft! text-text-muted flex h-30.25 w-full items-start rounded-md border-none p-2 text-sm font-normal"
                placeholder="Add message"
              />
            </div>
          </div>
          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              {" "}
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
              </DrawerClose>
              <Button
                onClick={() => setOpenNotifyModal(false)}
                className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm"
              >
                Notify
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      </div>
      {/* Tab view */}
      <div className="hidden md:block">
        <Modal
          open={openNotifyModal}
          setOpen={setOpenNotifyModal}
          title="Send Notification"
          ActionButton={
            <Button
              onClick={() => setOpenNotifyModal(false)}
              className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm"
            >
              Notify
            </Button>
          }
        >
          <div className="flex flex-col gap-5 px-6 py-4">
            <DialogDescription className="text-text-subtle text-sm font-normal">Add a short message</DialogDescription>

            <div className="mt-3 flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Message</Label>

              <Textarea
                className="bg-bg-input-soft! text-text-muted flex h-30.25 w-full items-start rounded-md border-none p-2 text-sm font-normal"
                placeholder="Add message"
              />
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export const ApproveModal = ({ openApproveModal, setOpenApproveModal, classArmName, onConfirm, isSubmitting }: ApproveModalProps) => {
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile && (
        <div className="block md:hidden">
          <MobileDrawer open={openApproveModal} setIsOpen={setOpenApproveModal} title="Approve Class Results">
            <div className="flex flex-col gap-5 px-6 py-4">
              <DialogDescription className="text-text-subtle text-sm font-normal">
                Are you sure you want to approve the results for {classArmName}?
              </DialogDescription>

              <div className="mt-3 flex flex-col gap-2">
                <div className="text-text-subtle border-border-default bg-bg-basic-blue-subtle rounded-md border px-3 py-2.5 text-sm shadow-sm">
                  Once approved, no further changes can be made unless you revoke approval. The results will remain hidden until you publish them
                  generally.
                </div>
              </div>
            </div>

            <div className="border-border-default border-t">
              <DialogFooter className="flex justify-between px-6 py-4">
                <DrawerClose asChild>
                  <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
                </DrawerClose>
                <Button
                  onClick={onConfirm}
                  disabled={isSubmitting}
                  className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm"
                >
                  {isSubmitting ? <Spinner className="size-4" /> : "Approve Results"}
                </Button>
              </DialogFooter>
            </div>
          </MobileDrawer>
        </div>
      )}
      {!isMobile && (
        <Modal
          open={openApproveModal}
          setOpen={setOpenApproveModal}
          className="hidden md:block"
          title="Approve Class Results"
          ActionButton={
            <Button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm"
            >
              {isSubmitting ? <Spinner className="size-4" /> : "Approve Results"}
            </Button>
          }
        >
          <div className="flex flex-col gap-5 px-6 py-4">
            <DialogDescription className="text-text-subtle text-sm font-normal">
              Are you sure you want to approve the results for {classArmName}?
            </DialogDescription>

            <div className="mt-3 flex flex-col gap-2">
              <div className="text-text-subtle border-border-default bg-bg-basic-blue-subtle rounded-md border px-3 py-2.5 text-sm shadow-sm">
                Once approved, no further changes can be made unless you revoke approval. The results will remain hidden until you publish them
                generally.
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export const EditModal = ({ openEditRequestModal, setEditRequestModal, subjectId, armId }: EditRequestProps) => {
  const { data: editRequestData } = useGetEditRequestBySubjectAndArm(subjectId, armId);
  const { mutate: approveRequest, isPending: isSubmitting } = useApproveEditRequest();
  const request = editRequestData?.data;

  const handleConfirm = (isApproved: boolean) => {
    if (!request?.editRequestId) return;

    approveRequest(
      { editAccessId: request.editRequestId, isApproved },
      {
        onSuccess: () => {
          toast.success(`Request ${isApproved ? "approved" : "rejected"} successfully`);
          setEditRequestModal(false);
        },
        onError: () => {
          toast.error(`Failed to ${isApproved ? "approve" : "reject"} request`);
        },
      },
    );
  };

  return (
    <>
      <div className="block md:hidden">
        <MobileDrawer open={openEditRequestModal} setIsOpen={setEditRequestModal} title="Manage edit access request">
          {" "}
          <DialogDescription className="text-text-subtle gap-5 px-6 py-4 text-sm font-normal">
            Review the teacher&apos;s request for edit access
          </DialogDescription>
          <div className="flex flex-col gap-5 px-6 pb-4">
            <div className="border-border-default rounded-sm border">
              <div className="border-border-default border-b p-3">
                <div className="flex items-center gap-2">
                  <Avatar className="size-5" />
                  <div className="text-text-default text-sm font-medium">{request?.teacherName || "--"}</div>
                </div>
                <span className="text-text-muted text-xs">{request?.teacherEmail || "--"}</span>
              </div>

              <div className="border-border-default flex flex-col gap-3 border-b p-3">
                <div className="flex items-center gap-2 text-left">
                  <div className="-ml-[3px] flex items-center gap-2">
                    <GraduationCap fill="var(--color-icon-default-muted)" className="text-left" />
                    <span className="text-text-muted text-sm font-medium">Class/Subject:</span>
                  </div>
                  <span className="text-text-default text-sm font-medium">
                    {request?.classArmName} {request?.subjectName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-left">
                  <div className="flex items-center gap-2 text-left">
                    <Calendar fill="var(--color-icon-default-muted)" />
                    <span className="text-text-muted text-sm font-medium">Term:</span>
                  </div>
                  <span className="text-text-default text-sm font-medium">
                    {request?.termName} {request?.sessionName}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 p-3">
                <div className="flex items-center gap-2">
                  <div className="text-text-muted text-sm font-medium">Reason:</div>
                  <div className="text-text-default text-sm font-medium">{request?.reason}</div>
                </div>

                <div className="flex items-center gap-2">
                  <StickyNote fill="var(--color-icon-default-muted)" />
                  <div className="text-text-muted text-sm font-medium">Note</div>
                </div>

                <div className="bg-bg-muted rounded-xs p-3">
                  <div className="text-text-default text-sm font-medium">{request?.additionalDetails || "No additional details provided."}</div>
                </div>

                <div className="flex items-center gap-2">
                  <Timee fill="var(--color-icon-default-muted)" />{" "}
                  {request?.dateCreated ? (
                    <div className="text-text-muted text-sm font-medium">Requested {formatRelativeDate(new Date(request?.dateCreated))}</div>
                  ) : (
                    "--"
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="border-border-default border-t">
            <DialogFooter className="flex justify-between px-6 py-4">
              <Button
                disabled={isSubmitting}
                onClick={() => handleConfirm(false)}
                className="bg-bg-state-destructive text-text-white-default h-7! rounded-md! px-4 py-2 text-sm font-medium"
              >
                Reject Access
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={() => handleConfirm(true)}
                className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! min-w-28 rounded-md px-2 py-1 text-sm"
              >
                {isSubmitting ? <Spinner className="size-4" /> : "Approve Results"}
              </Button>
            </DialogFooter>
          </div>
        </MobileDrawer>
      </div>
      <Modal
        open={openEditRequestModal}
        setOpen={setEditRequestModal}
        className="hidden md:block"
        title="Manage edit access request"
        cancelButton={
          <Button
            disabled={isSubmitting}
            onClick={() => handleConfirm(false)}
            className="bg-bg-state-destructive text-text-white-default h-7! rounded-md! px-4 py-2 text-sm font-medium"
          >
            Reject Access
          </Button>
        }
        ActionButton={
          <Button
            disabled={isSubmitting}
            onClick={() => handleConfirm(true)}
            className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! min-w-28 rounded-md px-2 py-1 text-sm"
          >
            {isSubmitting ? <Spinner className="size-4" /> : "Approve Access"}
          </Button>
        }
      >
        <DialogDescription className="text-text-subtle gap-5 px-6 py-4 text-sm font-normal">
          Review the teacher&apos;s request for edit access
        </DialogDescription>
        <div className="flex flex-col gap-5 px-6 pb-4">
          <div className="border-border-default rounded-sm border">
            <div className="border-border-default border-b p-3">
              <div className="flex items-center gap-2">
                <Avatar className="size-5" />
                <div className="text-text-default text-sm font-medium">{request?.teacherName || "--"}</div>
              </div>
              <span className="text-text-muted text-xs">{request?.teacherEmail || "--"}</span>
            </div>

            <div className="border-border-default flex flex-col gap-3 border-b p-3">
              <div className="flex items-center gap-2 text-left">
                <div className="-ml-[3px] flex items-center gap-2">
                  <GraduationCap fill="var(--color-icon-default-muted)" className="text-left" />
                  <span className="text-text-muted text-sm font-medium">Class/Subject:</span>
                </div>
                <span className="text-text-default text-sm font-medium">
                  {request?.classArmName} {request?.subjectName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-left">
                <div className="flex items-center gap-2 text-left">
                  <Calendar fill="var(--color-icon-default-muted)" />
                  <span className="text-text-muted text-sm font-medium">Term:</span>
                </div>
                <span className="text-text-default text-sm font-medium">
                  {request?.termName} {request?.sessionName}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 p-3">
              <div className="flex items-center gap-2">
                <div className="text-text-muted text-sm font-medium">Reason:</div>
                <div className="text-text-default text-sm font-medium">{request?.reason}</div>
              </div>

              <div className="flex items-center gap-2">
                <StickyNote fill="var(--color-icon-default-muted)" />
                <div className="text-text-muted text-sm font-medium">Note</div>
              </div>

              <div className="bg-bg-muted rounded-xs p-3">
                <div className="text-text-default text-sm font-medium">{request?.additionalDetails || "No additional details provided."}</div>
              </div>

              <div className="flex items-center gap-2">
                <Timee fill="var(--color-icon-default-muted)" />{" "}
                {request?.dateCreated ? (
                  <div className="text-text-muted text-sm font-medium">Requested {formatRelativeDate(new Date(request?.dateCreated))}</div>
                ) : (
                  "--"
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
