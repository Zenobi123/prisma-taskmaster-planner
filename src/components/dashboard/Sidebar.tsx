
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  FileText, 
  Wallet,
  FolderOpen,
  Receipt
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarGroupContent
} from "@/components/ui/sidebar";

const menuItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/collaborateurs", icon: Users, label: "Collaborateurs" },
  { path: "/clients", icon: Users, label: "Clients" },
  { path: "/gestion", icon: FolderOpen, label: "Gestion" },
  { path: "/missions", icon: Briefcase, label: "Mission" },
  { path: "/planning", icon: Calendar, label: "Planning" },
  { path: "/facturation", icon: Receipt, label: "Facturation" },
  { path: "/depenses", icon: Wallet, label: "Dépenses" },
  { path: "/rapports", icon: FileText, label: "Rapports" }
];

const DashboardSidebar = () => {
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <SidebarHeader className="border-b border-neutral-200">
        <h1 className="font-semibold text-neutral-800">
          PRISMA GESTION
        </h1>
      </SidebarHeader>
      
      <SidebarGroupContent className="flex-1 py-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path} active={isActiveRoute(item.path)}>
              <SidebarMenuButton asChild>
                <Link to={item.path} className="w-full">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
      
      <SidebarFooter className="border-t border-neutral-200 flex justify-center">
        <LogoutButton />
      </SidebarFooter>
    </>
  );
};

export default DashboardSidebar;
