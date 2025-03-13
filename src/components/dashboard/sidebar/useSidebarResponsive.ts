
import { useState, useEffect } from "react";

export function useSidebarResponsive(defaultOpen = true) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(defaultOpen);
  const [isMobile, setIsMobile] = useState(false);

  // Détection de l'écran mobile avec des points de rupture standard
  useEffect(() => {
    const checkMobile = () => {
      const isMobileScreen = window.innerWidth < 768;
      const isTabletScreen = window.innerWidth >= 768 && window.innerWidth < 1024;
      
      setIsMobile(isMobileScreen || isTabletScreen);
      
      if (isMobileScreen) {
        setIsSidebarOpen(false);
      } else if (isTabletScreen && isSidebarOpen) {
        // Sur tablette, garder le menu réduit par défaut
        setIsSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return {
    isSidebarOpen,
    setIsSidebarOpen,
    isMobile,
    toggleSidebar
  };
}
