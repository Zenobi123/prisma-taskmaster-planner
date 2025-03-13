
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  FileText, 
  Receipt, 
  Wallet,
  FolderOpen,
} from "lucide-react";
import { MenuItem } from "./types";

// Structure des menus avec sous-sections
export const menuItems: MenuItem[] = [
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

export const categoryLabels: Record<string, string> = {
  principal: "Principal",
  services: "Services",
  finance: "Finance"
};
