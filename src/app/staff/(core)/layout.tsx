import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { getSessionData } from "../../actions/auth";
import { OnboardingFlow } from "@/components/Onboarding/OnboardingFlow";
import { SessionRefresher } from "@/components/SessionRefresher";

export default async function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getSessionData();
  const showOnboarding = !user?.schoolId;

  // A user with no schoolId yet has nothing for the dashboard shell to query — Sidebar, Header,
  // and {children} all fire school-scoped requests (dashboard, branches, profile) on mount with
  // no guard, which used to race the "create school" submission and trip a backend transaction
  // rollback. Skip them until a school actually exists.
  //
  // Deliberately a single return with the chrome toggled inline, not an early-return branch:
  // `showOnboarding` flips false mid-flow (right after the onboarding wizard's branch-creation
  // step, before its own Welcome Plan step has shown), and any Server Action call — even one
  // that doesn't redirect — triggers Next.js to re-render this layout. An early-return branch
  // returns a structurally different tree on that re-render, which unmounts OnboardingFlow (and
  // the wizard it's mid-way through) instead of just re-rendering it. Keeping OnboardingFlow at
  // the same position in one tree lets it survive that transition.
  return (
    <div className="bg-bg-default fixed inset-0 flex overflow-hidden leading-5">
      <SessionRefresher />
      {!showOnboarding && <Sidebar />}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {!showOnboarding && <Header />}
        <div className="flex-1 overflow-y-auto">
          {!showOnboarding && children}
          <OnboardingFlow user={user} />
        </div>
      </div>
    </div>
  );
}
