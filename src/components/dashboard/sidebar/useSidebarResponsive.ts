
import { useState, useEffect } from "react";

export function useSidebarResponsive(defaultOpen = true) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(defaultOpen);
  const [isMobile, setIsMobile] = useState(false);

  // Détection de l'écran mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
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
