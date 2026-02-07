import { Avatar } from "@/components/Avatar";
import { Bank } from "@/components/Icons/Bank";
import { Modal } from "@/components/Modal";
import { getBadge } from "@/components/StudentProfile/StudentTable/StudentInvoiceTable";
import { Button } from "@/components/ui/button";
import { useClassesStore } from "@/store/classes";
import { Checkbox } from "@/components/ui/checkbox";
import AlertFill from "@/components/Icons/AlertFill";
import { MobileDrawer } from "@/components/MobileDrawer";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/useIsMobile";

export const PaymentDetailsModal = () => {
  const { isPaymentDetailsOpen, setIsPaymentDetailsOpen } = useClassesStore();
  const isMobile = useIsMobile();
  return (
    <>
      {!isMobile ? (
        <Modal
          open={isPaymentDetailsOpen}
          setOpen={setIsPaymentDetailsOpen}
          title="Payment Details"
          ActionButton={
            <Button className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm">
              Done
            </Button>
          }
        >
          <div className="m-2 flex flex-col gap-4">
            <div className="border-border-default flex justify-between border-b p-2">
              <div className="text-text-muted text-sm font-medium">Date</div>
              <div className="text-text-default text-sm font-medium">June 25, 2025 </div>
            </div>
            <div className="border-border-default flex justify-between border-b p-2">
              <div className="text-text-muted text-sm font-medium">Amount</div>
              <div className="text-text-default text-sm font-medium">₦50,000</div>
            </div>
            <div className="border-border-default flex justify-between border-b p-2">
              <div className="text-text-muted text-sm font-medium">Payment Method</div>
              <div className="flex items-center gap-2">
                <Bank fill="var(--color-bg-basic-purple-accent)" />

                <div className="text-text-default text-sm font-medium">Bank Transfer</div>
              </div>
            </div>
            <div className="border-border-default flex justify-between border-b p-2">
              <div className="text-text-muted text-sm font-medium">Paid By</div>
              <div className="flex items-center">
                <Avatar className="mr-2 size-5" />
                <div className="text-text-default text-sm font-medium"> Damilare John </div>
              </div>
            </div>
            <div className="flex justify-between p-2">
              <div className="text-text-muted text-sm font-medium">Status</div>
              <div className="text-text-default text-sm font-medium">{getBadge("Successful")} </div>
            </div>

            <div className="border-border-default mb-6 flex flex-col gap-3 rounded-sm border p-4">
              <div className="text-text-default text-sm font-semibold">Note</div>
              <div className="text-text-default text-sm font-normal">I bought it because I had too much money so I bought fuel because why not?</div>
            </div>
          </div>
        </Modal>
      ) : (
        <MobileDrawer open={isPaymentDetailsOpen} setIsOpen={setIsPaymentDetailsOpen} title="Payment Details">
          <div className="m-2 flex flex-col gap-4">
            <div className="border-border-default flex justify-between border-b p-2">
              <div className="text-text-muted text-sm font-medium">Date</div>
              <div className="text-text-default text-sm font-medium">June 25, 2025 </div>
            </div>
            <div className="border-border-default flex justify-between border-b p-2">
              <div className="text-text-muted text-sm font-medium">Amount</div>
              <div className="text-text-default text-sm font-medium">₦50,000</div>
            </div>
            <div className="border-border-default flex justify-between border-b p-2">
              <div className="text-text-muted text-sm font-medium">Payment Method</div>
              <div className="flex items-center gap-2">
                <Bank fill="var(--color-bg-basic-purple-accent)" />

                <div className="text-text-default text-sm font-medium">Bank Transfer</div>
              </div>
            </div>
            <div className="border-border-default flex justify-between border-b p-2">
              <div className="text-text-muted text-sm font-medium">Paid By</div>
              <div className="flex items-center">
                <Avatar className="mr-2 size-5" />
                <div className="text-text-default text-sm font-medium"> Damilare John </div>
              </div>
            </div>
            <div className="flex justify-between p-2">
              <div className="text-text-muted text-sm font-medium">Status</div>
              <div className="text-text-default text-sm font-medium">{getBadge("Successful")} </div>
            </div>

            <div className="border-border-default mb-6 flex flex-col gap-3 rounded-sm border p-4">
              <div className="text-text-default text-sm font-semibold">Note</div>
              <div className="text-text-default text-sm font-normal">I bought it because I had too much money so I bought fuel because why not?</div>
            </div>
          </div>
          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-2 py-1 text-sm font-medium">Cancel</Button>
              </DrawerClose>

              <Button className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm">
                Done
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      )}
    </>
  );
};

export const DeletePaymentModal = () => {
  const { deletePayment, setDeletePayment } = useClassesStore();
  const isMobile = useIsMobile();
  return (
    <div>
      {!isMobile ? (
        <Modal
          open={deletePayment}
          setOpen={setDeletePayment}
          title="Delete Invoice?"
          ActionButton={
            <Button className="hover:text-text-white-default! bg-bg-state-disabled text-text-hint hover:bg-bg-state-destructive! h-7! rounded-md px-2 py-1 text-sm">
              Delete Invoice
            </Button>
          }
        >
          <div className="flex flex-col gap-4 px-6 py-5">
            <div className="text-text-subtle text-sm font-normal">
              Are you sure you want to permanently delete this invoice? This action cannot be undone.
            </div>

            <div className="border-border-default bg-bg-basic-orange-subtle flex items-center gap-3 rounded-sm border px-3 py-2.5">
              <AlertFill fill="var(--color-bg-basic-orange-accent)" className="h-12 w-12" />

              <div className="text-text-subtle text-normal text-sm">
                Deleting will remove the invoice from the parent’s portal, erase its payment history from reports, and disconnect it from the
                student’s financial records. Once deleted, this invoice cannot be restored.
              </div>
            </div>

            <div className="flex-start flex gap-3">
              <Checkbox />
              <div className="text-text-subtle text-sm font-normal">I understand that deleting this invoice is permanent and cannot be undone.</div>
            </div>
          </div>
        </Modal>
      ) : (
        <MobileDrawer open={deletePayment} setIsOpen={setDeletePayment} title="Delete Invoice?">
          <div className="flex flex-col gap-4 px-6 py-5">
            <div className="text-text-subtle text-sm font-normal">
              Are you sure you want to permanently delete this invoice? This action cannot be undone.
            </div>

            <div className="border-border-default bg-bg-basic-orange-subtle flex items-center gap-3 rounded-sm border px-3 py-2.5">
              <AlertFill fill="var(--color-bg-basic-orange-accent)" className="h-24 w-24" />

              <div className="text-text-subtle text-normal text-sm">
                Deleting will remove the invoice from the parent’s portal, erase its payment history from reports, and disconnect it from the
                student’s financial records. Once deleted, this invoice cannot be restored.
              </div>
            </div>

            <div className="flex-start flex gap-3">
              <Checkbox />
              <div className="text-text-subtle text-sm font-normal">I understand that deleting this invoice is permanent and cannot be undone.</div>
            </div>
          </div>

          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
              </DrawerClose>

              <Button className="hover:text-text-white-default! bg-bg-state-disabled text-text-hint hover:bg-bg-state-destructive! h-7! rounded-md px-2 py-1 text-sm">
                Delete Invoice
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      )}
    </div>
  );
};
