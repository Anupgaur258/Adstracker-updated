import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen min-w-0">
        <Header />
        <main className="flex-1 px-4 py-3 sm:px-6 sm:py-4 md:px-8 lg:px-10 md:py-4 overflow-y-auto scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  );
}
