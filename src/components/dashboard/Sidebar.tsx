
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  FileText, 
  Menu, 
  Receipt, 
  Wallet,
  ChevronRight,
  FolderOpen,
  X
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { cn } from "@/lib/utils";

// Structure des menus avec sous-sections
const menuItems = [
  { 
    path: "/", 
    icon: LayoutDashboard, 
    label: "Dashboard",
    category: "principal"
  },
  { 
    path: "/collaborateurs", 
    icon: Users, 
    label: "Collaborateurs",
    category: "principal"
  },
  { 
    path: "/clients", 
    icon: Users, 
    label: "Clients",
    category: "principal"
  },
  { 
    path: "/gestion", 
    icon: FolderOpen, 
    label: "Gestion",
    category: "services"
  },
  { 
    path: "/missions", 
    icon: Briefcase, 
    label: "Missions",
    category: "services"
  },
  { 
    path: "/planning", 
    icon: Calendar, 
    label: "Planning",
    category: "services"
  },
  { 
    path: "/facturation", 
    icon: Receipt, 
    label: "Facturation",
    category: "finance"
  },
  { 
    path: "/depenses", 
    icon: Wallet, 
    label: "Dépenses",
    category: "finance"
  },
  { 
    path: "/rapports", 
    icon: FileText, 
    label: "Rapports",
    category: "finance"
  }
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

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

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

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
  const categoryLabels: Record<string, string> = {
    principal: "Principal",
    services: "Services",
    finance: "Finance"
  };

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
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <aside
        className={cn(
          "bg-white border-r border-neutral-200 transition-all duration-300 ease-in-out flex flex-col fixed h-full z-50 md:relative",
          isSidebarOpen ? "w-64" : "w-[70px]",
          isMobile && !isSidebarOpen && "translate-x-[-100%]"
        )}
      >
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h1
              className={cn(
                "font-semibold text-neutral-800 transition-opacity duration-300 whitespace-nowrap",
                !isSidebarOpen && "opacity-0 invisible"
              )}
            >
              PRISMA GESTION
            </h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-neutral-100 rounded-md transition-colors"
              aria-label={isSidebarOpen ? "Réduire le menu" : "Agrandir le menu"}
            >
              {isMobile && isSidebarOpen ? (
                <X className="w-5 h-5 text-neutral-600" />
              ) : (
                <Menu className="w-5 h-5 text-neutral-600" />
              )}
            </button>
          </div>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-4 overflow-y-auto">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} className="space-y-1">
              {isSidebarOpen && (
                <h2 className="text-xs font-semibold text-neutral-500 uppercase px-3 py-2">
                  {categoryLabels[category] || category}
                </h2>
              )}
              
              <div className="space-y-1">
                {items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleMobileClose}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md transition-all group relative",
                      isActiveRoute(item.path) 
                        ? "bg-[#84A98C] text-white" 
                        : "text-neutral-600 hover:bg-[#F2FCE2] hover:text-neutral-800",
                      !isSidebarOpen && "justify-center"
                    )}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 shrink-0",
                      isActiveRoute(item.path) && "text-white"
                    )} />
                    <span
                      className={cn(
                        "ml-3 transition-opacity duration-300 whitespace-nowrap",
                        !isSidebarOpen && "opacity-0 invisible absolute"
                      )}
                    >
                      {item.label}
                    </span>
                    {!isSidebarOpen && (
                      <div className="absolute left-14 bg-neutral-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                        {item.label}
                      </div>
                    )}
                    {isActiveRoute(item.path) && isSidebarOpen && (
                      <ChevronRight className="w-4 h-4 ml-auto text-white" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className={cn(
          "p-4 border-t border-neutral-200",
          !isSidebarOpen && "flex justify-center"
        )}>
          <LogoutButton />
        </div>
      </aside>
      
      {/* Bouton pour réouvrir le menu sur mobile */}
      {isMobile && !isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-4 left-4 z-50 p-3 rounded-full bg-[#84A98C] text-white shadow-lg hover:bg-[#6B8E74] transition-colors"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default Sidebar;
