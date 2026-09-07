import { ManageAccessGate } from "@/components/StudentAndParent/ManageAccessGate";
import { AddStudent } from "@/components/StudentAndParent/StudentMutation/AddStudent";

export default function page() {
  return (
    <ManageAccessGate>
      <AddStudent />
    </ManageAccessGate>
  );
}
