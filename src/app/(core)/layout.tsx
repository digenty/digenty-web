import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { getSessionData } from "../actions/auth";
import OnboardingModal from "@/components/Onboarding/OnBoardingModal";

export default async function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getSessionData();
  const showOnboarding = user?.schoolId === 31;
  console.log("User data in layout:", user);

  return (
    <div className="bg-bg-default fixed inset-0 flex overflow-hidden leading-5">
      <Sidebar />
      <div className="flex min-h-0 flex-1 flex-col">
        <Header />
        <div className="flex-1 overflow-y-auto">
          {children}
          {showOnboarding && <OnboardingModal initialShow={showOnboarding} />}
        </div>
      </div>
    </div>
  );
}
