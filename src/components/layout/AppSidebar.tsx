import { Calendar, Users, BriefCase, Clock, FileText, Bell, LogOut, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Tableau de bord", icon: Settings, path: "/" },
  { title: "Collaborateurs", icon: Users, path: "/collaborateurs" },
  { title: "Clients", icon: Users, path: "/clients" },
  { title: "Missions/tâches", icon: BriefCase, path: "/tasks" },
  { title: "Planning", icon: Calendar, path: "/planning" },
  { title: "Suivi du temps", icon: Clock, path: "/temps" },
  { title: "Rapports", icon: FileText, path: "/rapports" },
];

const secondaryItems = [
  { title: "Notifications", icon: Bell, path: "/notifications" },
  { title: "Déconnexion", icon: LogOut, onClick: () => {} },
];

export function AppSidebar() {
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    });
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-4">
          <h2 className="text-lg font-semibold">Cabinet XYZ</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.path}
                      className={location.pathname === item.path ? "active" : ""}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild={!item.onClick}
                    onClick={item.onClick || handleLogout}
                  >
                    {item.onClick ? (
                      <button className="w-full flex items-center gap-2">
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </button>
                    ) : (
                      <Link to={item.path}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}