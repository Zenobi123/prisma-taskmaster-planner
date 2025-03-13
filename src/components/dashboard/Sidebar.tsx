
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import LogoutButton from "@/components/LogoutButton";
import { useSidebarResponsive } from "./sidebar/useSidebarResponsive";
import { menuItems, categoryLabels } from "./sidebar/menuItems";
import MenuCategory from "./sidebar/MenuCategory";
import SidebarHeader from "./sidebar/SidebarHeader";
import MobileMenuButton from "./sidebar/MobileMenuButton";
import ThemeToggle from "@/components/theme/ThemeToggle";

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen, isMobile, toggleSidebar } = useSidebarResponsive();
  const location = useLocation();

  // Group menu items by category
  const getMenuCategories = () => {
    const categories = menuItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, typeof menuItems>);

    return categories;
  };

  const categories = getMenuCategories();

  // Gestion de la fermeture du menu sur mobile
  const handleMobileClose = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Overlay pour fermer la sidebar sur mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden dark:bg-black/50"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <aside
        className={cn(
          "bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 ease-in-out flex flex-col fixed h-full z-50 md:relative",
          isSidebarOpen ? "w-64" : "w-[70px]",
          isMobile && !isSidebarOpen && "translate-x-[-100%]"
        )}
      >
        <SidebarHeader 
          isSidebarOpen={isSidebarOpen} 
          isMobile={isMobile} 
          toggleSidebar={toggleSidebar} 
        />

        <nav className="flex-1 py-4 px-2 space-y-4 overflow-y-auto">
          {Object.entries(categories).map(([category, items]) => (
            <MenuCategory
              key={category}
              category={category}
              categoryLabel={categoryLabels[category] || category}
              items={items}
              isSidebarOpen={isSidebarOpen}
              handleMobileClose={handleMobileClose}
            />
          ))}
        </nav>

        <div className={cn(
          "p-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-2",
          !isSidebarOpen && "items-center"
        )}>
          <ThemeToggle isSidebarOpen={isSidebarOpen} />
          <LogoutButton isSidebarOpen={isSidebarOpen} />
        </div>
      </aside>
      
      {/* Bouton pour réouvrir le menu sur mobile */}
      {isMobile && !isSidebarOpen && (
        <MobileMenuButton onClick={() => setIsSidebarOpen(true)} />
      )}
    </>
  );
};

export default Sidebar;
