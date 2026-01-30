import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { decodeJWT } from "@/lib/utils";
import { JWTPayload } from "@/types";
import { getSessionData } from "../actions/auth";
import OnboardingModal from "@/components/Onboarding/OnBoardingModal";
export default async function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { token } = await getSessionData();

  const user: JWTPayload = decodeJWT(token);
  const showOnboarding = !user.schoolId;

  return (
    <>
      {showOnboarding && <OnboardingModal initialShow={showOnboarding} />}
      <div className="bg-bg-default fixed inset-0 flex overflow-hidden leading-5">
        <Sidebar />
        <div className="flex min-h-0 flex-1 flex-col">
          <Header />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </>
  );
}
