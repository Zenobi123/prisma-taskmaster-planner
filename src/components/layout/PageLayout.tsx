
import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
