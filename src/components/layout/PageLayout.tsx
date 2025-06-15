
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
      <main className={`w-full pb-8 ${
        fullWidth 
          ? 'px-0.5 py-1 sm:px-1 sm:py-2' 
          : !isMobile 
            ? 'container px-1 py-2 md:py-3 lg:px-2' 
            : 'px-1 py-1 sm:px-2 sm:py-3'
      }`}>
        {children}
      </main>
    </div>
  );
};

export { PageLayout };
export default PageLayout;
