import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FolderOpen,
  MoreHorizontal,
  Calendar,
  FileText,
  Receipt,
  Settings,
  Mail,
  HelpCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import LogoutButton from "@/components/LogoutButton";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type NavItem = {
  path: string;
  icon: React.ElementType;
  label: string;
  allowedRoles?: string[];
};

// Onglets principaux toujours visibles dans la barre (max 4 + bouton « Plus »).
const primaryItems: NavItem[] = [
  { path: "/", icon: LayoutDashboard, label: "Accueil" },
  { path: "/clients", icon: Users, label: "Clients" },
  { path: "/gestion", icon: FolderOpen, label: "Gestion" },
  { path: "/missions", icon: Briefcase, label: "Missions" },
];

// Menu complet présenté dans le panneau « Plus ».
const allItems: NavItem[] = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/collaborateurs", icon: Users, label: "Collaborateurs", allowedRoles: ["admin"] },
  { path: "/clients", icon: Users, label: "Clients" },
  { path: "/gestion", icon: FolderOpen, label: "Gestion" },
  { path: "/missions", icon: Briefcase, label: "Missions" },
  { path: "/planning", icon: Calendar, label: "Planning" },
  { path: "/facturation", icon: Receipt, label: "Facturation", allowedRoles: ["admin"] },
  { path: "/courrier", icon: Mail, label: "Courrier" },
  { path: "/rapports", icon: FileText, label: "Rapports" },
  { path: "/parametres", icon: Settings, label: "Paramètres", allowedRoles: ["admin"] },
  { path: "/aide", icon: HelpCircle, label: "Aide" },
];

/**
 * Barre de navigation fixe en bas d'écran, affichée uniquement sur mobile.
 * Donne un accès en un tap aux sections principales depuis n'importe quelle page,
 * avec un panneau « Plus » regroupant l'ensemble du menu (filtré par rôle) + déconnexion.
 */
const MobileBottomNav = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();
        if (active && data) {
          setUserRole(data.role);
        }
      }
    };
    fetchRole();
    return () => {
      active = false;
    };
  }, []);

  // Réserve l'espace bas pour que le contenu ne passe pas sous la barre fixe.
  useEffect(() => {
    if (!isMobile) return;
    document.body.classList.add("has-bottom-nav");
    return () => document.body.classList.remove("has-bottom-nav");
  }, [isMobile]);

  // Ferme le panneau « Plus » à chaque changement de route.
  useEffect(() => {
    setIsMoreOpen(false);
  }, [location.pathname]);

  if (!isMobile) return null;

  const canSee = (item: NavItem) =>
    !item.allowedRoles || item.allowedRoles.includes(userRole || "");
  const isActive = (path: string) => location.pathname === path;

  const visiblePrimary = primaryItems.filter(canSee);
  const visibleAll = allItems.filter(canSee);
  const moreActive = !visiblePrimary.some((item) => isActive(item.path));

  return (
    <>
      <nav
        className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-neutral-200 shadow-[0_-1px_4px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]"
        aria-label="Navigation principale"
      >
        <div
          className="grid h-16"
          style={{ gridTemplateColumns: `repeat(${visiblePrimary.length + 1}, minmax(0, 1fr))` }}
        >
          {visiblePrimary.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              aria-current={isActive(item.path) ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors active:scale-95",
                isActive(item.path)
                  ? "text-primary"
                  : "text-neutral-500 hover:text-neutral-800"
              )}
            >
              <item.icon
                className={cn("h-5 w-5 transition-transform", isActive(item.path) && "scale-110")}
              />
              <span className="leading-none">{item.label}</span>
            </Link>
          ))}
          <button
            type="button"
            onClick={() => setIsMoreOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={isMoreOpen}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors active:scale-95",
              moreActive ? "text-primary" : "text-neutral-500 hover:text-neutral-800"
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="leading-none">Plus</span>
          </button>
        </div>
      </nav>

      <Sheet open={isMoreOpen} onOpenChange={setIsMoreOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl max-h-[80vh] overflow-y-auto pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
        >
          <SheetHeader className="text-left mb-3">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-2">
            {visibleAll.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive(item.path) ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-xs font-medium text-center transition-colors min-h-[72px]",
                  isActive(item.path)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-neutral-200 text-neutral-600 hover:bg-neutral-50 active:bg-neutral-100"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="leading-tight">{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-200 flex justify-center">
            <LogoutButton />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileBottomNav;
