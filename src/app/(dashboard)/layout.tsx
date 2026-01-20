import { SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar";
import { AppSidebar } from "@/src/components/common/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex items-center p-4 md:hidden">
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
