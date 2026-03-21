import Image from "next/image";

export default function ParentOnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-bg-default flex w-full">
      <div className="hidden md:fixed md:top-0 md:left-0 md:block md:h-screen md:w-1/2 md:bg-[url(/images/bg-image-2.png)] md:bg-cover md:bg-center md:bg-no-repeat" />

      <div className="flex min-h-screen w-full flex-col gap-10 px-5 md:ml-[50%] md:w-1/2 md:px-12 md:pt-5">
        <div className="flex items-center gap-2">
          <Image src="/icons/Logomark.svg" width={24} height={24} alt="Digenty logo" />
          <p className="text-text-default text-sm font-medium">Digenty</p>
        </div>
        <div className="flex">
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
