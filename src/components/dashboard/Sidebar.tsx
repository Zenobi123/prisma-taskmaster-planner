
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  FileText, 
  Menu, 
  Wallet,
  ChevronRight,
  FolderOpen,
  Receipt,
  Settings
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

type MenuItem = {
  path: string;
  icon: React.ElementType;
  label: string;
  adminOnly?: boolean;
  allowedRoles?: string[];
};

const menuItems: MenuItem[] = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/collaborateurs", icon: Users, label: "Collaborateurs", allowedRoles: ["admin"] },
  { path: "/clients", icon: Users, label: "Clients" },
  { path: "/gestion", icon: FolderOpen, label: "Gestion" },
  { path: "/missions", icon: Briefcase, label: "Mission" },
  { path: "/planning", icon: Calendar, label: "Planning" },
  { path: "/facturation", icon: Receipt, label: "Facturation" },
  { path: "/depenses", icon: Wallet, label: "Dépenses" },
  { path: "/rapports", icon: FileText, label: "Rapports" },
  { path: "/parametres", icon: Settings, label: "Paramètres", allowedRoles: ["admin"] }
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const userRole = localStorage.getItem("userRole");
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    !item.allowedRoles || item.allowedRoles.includes(userRole || "")
  );

  return (
    <aside
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-white border-r border-neutral-200 transition-all duration-300 ease-in-out flex flex-col`}
    >
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <h1
            className={`font-semibold text-neutral-800 transition-opacity duration-300 ${
              !isSidebarOpen && "opacity-0 hidden"
            }`}
          >
            PRISMA GESTION
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-neutral-100 rounded-md transition-colors"
            aria-label={isSidebarOpen ? "Réduire le menu" : "Agrandir le menu"}
          >
            <Menu className="w-5 h-5 text-neutral-600" />
          </button>
        </div>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {filteredMenuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link group relative ${
              isActiveRoute(item.path) && "active"
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span
              className={`transition-opacity duration-300 ${
                !isSidebarOpen && "opacity-0 hidden"
              }`}
            >
              {item.label}
            </span>
            {!isSidebarOpen && (
              <div className="absolute left-14 bg-neutral-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
            {isActiveRoute(item.path) && (
              <ChevronRight className={`w-4 h-4 ml-auto ${!isSidebarOpen && "hidden"}`} />
            )}
          </Link>
        ))}
      </nav>

      <div className={`p-4 border-t border-neutral-200 ${!isSidebarOpen && "flex justify-center"}`}>
        <LogoutButton />
      </div>
    </aside>
  );
};

export default Sidebar;
