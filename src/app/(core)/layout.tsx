import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-bg-default flex h-screen overflow-hidden leading-5">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Header />
        <div className="h-screen overflow-y-auto pb-12">{children}</div>
      </div>
    </div>
  );
}
