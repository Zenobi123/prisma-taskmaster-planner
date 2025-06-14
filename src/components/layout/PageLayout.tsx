
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PageLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const PageLayout = ({ children, fullWidth = false }: PageLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className={`w-full pb-16 ${
        fullWidth 
          ? 'px-1 py-2 sm:px-2 sm:py-4' 
          : !isMobile 
            ? 'container px-4 py-6 md:py-8 lg:px-6' 
            : 'px-3 py-3 sm:px-4 sm:py-6'
      }`}>
        {children}
      </main>
    </div>
  );
};

export { PageLayout };
export default PageLayout;
