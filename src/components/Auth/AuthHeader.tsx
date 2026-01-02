import Image from "next/image";

export const AuthHeader = () => {
  return (
    <header className="py-9 md:py-12">
      <div className="flex items-center gap-2">
        <Image src="/icons/Logomark.svg" width={32} height={32} alt="Digenty logo" className="text-icon-default-subtle" />
        <p className="text-text-default text-lg font-semibold">Digenty</p>
      </div>
    </header>
  );
};
