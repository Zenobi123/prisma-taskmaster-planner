
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  FileText, 
  Calendar, 
  UserCog, 
  Settings,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Missions", href: "/missions", icon: FileText },
    { name: "Planning", href: "/planning", icon: Calendar },
    { name: "Collaborateurs", href: "/collaborateurs", icon: UserCog },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  if (isMobile) {
    return (
      <>
        {/* Menu hamburger pour mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-white shadow-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Sidebar mobile */}
        <div className={`
          fixed top-0 left-0 h-full w-80 max-w-[80vw] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-xl font-semibold text-neutral-800">Navigation</h2>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {navigation.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                        ${isActive(item.href) 
                          ? 'bg-primary text-white shadow-sm' 
                          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                        }
                      `}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>

        {/* Navigation bottom bar pour mobile */}
        <div className="bg-white border-t border-neutral-200 px-2 py-2">
          <div className="flex justify-around">
            {navigation.slice(0, 4).map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`
                    flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 min-w-0 flex-1
                    ${isActive(item.href) 
                      ? 'text-primary' 
                      : 'text-neutral-600'
                    }
                  `}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className="w-64 bg-white border-r border-neutral-200 flex flex-col">
      <div className="p-6 border-b border-neutral-200">
        <h2 className="text-xl font-semibold text-neutral-800">Navigation</h2>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive(item.href) 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  }
                `}
              >
                <IconComponent className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
