
import React from "react";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent,
  SidebarInset
} from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/Sidebar";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarContent>
            <DashboardSidebar />
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="p-0 overflow-x-hidden">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default PageLayout;
