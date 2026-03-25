import { ParentHeader } from "@/parentComponents/ParentHeader";
import { ParentSidebar } from "@/parentComponents/ParentSidebar";

export default function ParentOnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-bg-default fixed inset-0 flex overflow-hidden leading-5">
      <ParentSidebar />
      <div className="flex min-h-0 flex-1 flex-col">
        <ParentHeader />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
