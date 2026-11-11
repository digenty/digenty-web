import Image from "next/image";

export default function ParentOnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-bg-default flex w-full">
      <div className="hidden md:fixed md:top-0 md:left-0 md:block md:h-screen md:w-1/2 md:bg-[url(/images/bg-image-2.png)] md:bg-cover md:bg-center md:bg-no-repeat" />

      <div className="flex w-full flex-col gap-10 px-5 pt-5 md:fixed md:top-0 md:right-0 md:h-screen md:w-1/2 md:overflow-y-auto md:px-12 md:pb-10">
        <Image src="/icons/Logomark.svg" width={65} height={27} alt="Axis logo" />
        <div className="flex">
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
