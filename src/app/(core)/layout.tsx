import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-bg-default flex leading-5 text-zinc-600">
      <Sidebar />
      <div className="h-screen flex-1 overflow-y-auto">
        <Header />
        <div className="">{children}</div>
      </div>
    </div>
  );
}
