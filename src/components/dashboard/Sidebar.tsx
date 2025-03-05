
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import LogoutButton from "../LogoutButton";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role || "");
  }, []);

  const mainNavItems = [
    { label: "Tableau de bord", path: "/" },
    { label: "Clients", path: "/clients" },
    { label: "Collaborateurs", path: "/collaborateurs" },
    { label: "Missions", path: "/missions" },
    { label: "Gestion", path: "/gestion" },
    { label: "Facturation", path: "/facturation" },
  ];

  const secondaryNavItems = [
    { label: "Planning", path: "/planning" },
    { label: "Temps", path: "/temps" },
    { label: "Dépenses", path: "/depenses" },
    { label: "Rapports", path: "/rapports" },
  ];

  // Ajout d'une section administrative pour les admins
  const adminNavItems = [
    { label: "Gestion des utilisateurs", path: "/admin/users" },
  ];

  return (
    <div className="h-full w-64 flex flex-col bg-white border-r">
      <div className="p-6">
        <h1 className="text-xl font-semibold text-neutral-800">PRISMA GESTION</h1>
      </div>

      <div className="flex-1 px-4 space-y-6 overflow-auto">
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors",
                location.pathname === item.path
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t">
          <h2 className="px-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Outils
          </h2>
          <nav className="mt-2 space-y-1">
            {secondaryNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                  location.pathname === item.path
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Section d'administration pour les admins */}
        {userRole === "admin" && (
          <div className="pt-4 border-t">
            <h2 className="px-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Administration
            </h2>
            <nav className="mt-2 space-y-1">
              {adminNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    location.pathname === item.path
                      ? "bg-neutral-100 text-neutral-900"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;
