import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-default flex h-screen leading-5 text-zinc-600">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
