
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Users, 
  FileText, 
  BarChart, 
  Calendar, 
  Settings, 
  DollarSign,
  Building,
  Clock,
  CreditCard,
  Mail
} from "lucide-react";

const Sidebar = () => {
  const navigation = [
    { name: "Tableau de bord", href: "/", icon: Home },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Facturation", href: "/facturation", icon: DollarSign },
    { name: "Gestion", href: "/gestion", icon: Building },
    { name: "Planning", href: "/planning", icon: Calendar },
    { name: "Collaborateurs", href: "/collaborateurs", icon: Users },
    { name: "Rapports", href: "/rapports", icon: BarChart },
    { name: "Courrier", href: "/courrier", icon: Mail },
    { name: "Missions", href: "/missions", icon: FileText },
    { name: "Temps", href: "/temps", icon: Clock },
    { name: "Dépenses", href: "/depenses", icon: CreditCard },
    { name: "Paramètres", href: "/parametres", icon: Settings },
  ];

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-md border-r border-gray-200 z-10">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">ComptaFlow</h1>
      </div>
      
      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
