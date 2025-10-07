import { Breadcrumb } from "./Breadcrumb";

export const Header = () => {
  return (
    <header className="border-default-transparent/10 flex h-16 w-full items-center border-b px-8 py-4 text-zinc-950">
      <Breadcrumb />
    </header>
  );
};
